import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'plugins/parcel'
ALLOWED = {'plugin.json', 'mcp.json', '.mcp.json', '.codex-plugin', '.claude-plugin',
           'README.md', 'LICENSE', 'assets', 'skills', 'references'}


def inventory(source):
    files = {}
    names = set()
    for path in sorted(source.rglob('*')):
        name = path.relative_to(source).as_posix()
        if path.is_symlink():
            raise ValueError(f'Symlink forbidden: {name}')
        if name.split('/')[0] not in ALLOWED:
            raise ValueError(f'Unexpected package content: {name}')
        for part in name.split('/'):
            if (part.endswith(('.', ' ')) or ':' in part or '\\' in part
                    or re.match(r'^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)', part, re.I)):
                raise ValueError(f'Nonportable filename: {name}')
        if name.casefold() in names:
            raise ValueError(f'Case-insensitive collision: {name}')
        names.add(name.casefold())
        if path.is_dir():
            continue
        if not path.is_file():
            raise ValueError(f'Not a regular file: {name}')
        data = path.read_bytes()
        if data.startswith(b'version https://git-lfs.github.com/spec/v1'):
            raise ValueError(f'LFS pointer: {name}')
        limit = 5 * 1024 * 1024 if path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.svg'} else 256 * 1024
        if len(data) > limit:
            raise ValueError(f'File exceeds directory size limit: {name}')
        if path.suffix == '.json':
            obj = json.loads(data)
            if isinstance(obj, dict) and (obj.get('apps') is not None or obj.get('hooks') is not None):
                raise ValueError(f'Private app binding or hooks: {name}')
        files[name] = data
    if len(files) > 512 or sum(map(len, files.values())) > 50 * 1024 * 1024:
        raise ValueError('Package exceeds conservative directory limits')
    return files


def write_zip(path, files):
    with zipfile.ZipFile(path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(files.items()):
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, data, compresslevel=9)


def inspect_zip(path, expected):
    with zipfile.ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError('ZIP checksum failure')
        if archive.namelist() != sorted(expected):
            raise ValueError('ZIP inventory differs from package')
        for name, data in expected.items():
            if archive.read(name) != data:
                raise ValueError(f'ZIP bytes differ: {name}')
        with tempfile.TemporaryDirectory(prefix='parcel-package-') as directory:
            archive.extractall(directory)
            if inventory(Path(directory)) != expected:
                raise ValueError('Extracted package differs')
            subprocess.run(['node', 'scripts/validate.mjs', directory], cwd=ROOT, check=True)


def main():
    parser = argparse.ArgumentParser(description='Create and inspect a Parcel plugin archive')
    parser.add_argument('--output', type=Path, default=ROOT / 'dist')
    parser.add_argument('--tag', help='Require an exact release tag matching the packaged version')
    args = parser.parse_args()
    subprocess.run(['node', 'scripts/validate.mjs'], cwd=ROOT, check=True)
    version = json.loads((SOURCE / 'plugin.json').read_text())['version']
    if args.tag is not None and args.tag != f'v{version}':
        parser.error(f'Tag must equal v{version}')
    files = inventory(SOURCE)
    args.output.mkdir(parents=True, exist_ok=True)
    archive = args.output / f'parcel-{version}.zip'
    write_zip(archive, files)
    inspect_zip(archive, files)
    checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
    archive.with_suffix('.zip.sha256').write_text(f'{checksum}  {archive.name}\n')
    report = {'version': version, 'archive': archive.name, 'sha256': checksum,
              'files': [{'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                        for name, data in sorted(files.items())]}
    archive.with_suffix('.inventory.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'Inspected {len(files)} files: {archive}')


if __name__ == '__main__':
    main()

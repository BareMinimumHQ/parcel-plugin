import tempfile
import unittest
from pathlib import Path
import zipfile
from package import inventory, write_zip, inspect_zip


class PackageTests(unittest.TestCase):
    def test_deterministic_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            a, b = Path(tmp)/'a.zip', Path(tmp)/'b.zip'
            write_zip(a, {'README.md': b'hello', 'plugin.json': b'{}'})
            write_zip(b, {'plugin.json': b'{}', 'README.md': b'hello'})
            self.assertEqual(a.read_bytes(), b.read_bytes())

    def test_rejects_leaked_files_and_bindings(self):
        for name, data in [('.app.json', b'{}'), ('plugin.json', b'{"apps":"./.app.json"}'),
                           ('assets/CON.png', b'bytes'), ('README.md', b'x' * (256*1024+1))]:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp)/name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
                with self.assertRaises(ValueError):
                    inventory(Path(tmp))

    def test_rejects_symlinks_and_case_collisions(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root/'README.md').write_text('hello')
            (root/'readme.md').symlink_to(root/'README.md')
            with self.assertRaises(ValueError):
                inventory(root)
            (root/'readme.md').unlink()
            (root/'readme.md').write_text('collision')
            with self.assertRaises(ValueError):
                inventory(root)

    def test_rejects_archive_injection(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)/'bad.zip'
            write_zip(path, {'README.md': b'hello'})
            with zipfile.ZipFile(path, 'a') as archive:
                archive.writestr('../escape', b'bad')
            with self.assertRaises(ValueError):
                inspect_zip(path, {'README.md': b'hello'})


if __name__ == '__main__':
    unittest.main()

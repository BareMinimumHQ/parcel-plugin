---
agent:
  instruction: Keep icon references and submission instructions aligned with these assets.
  on-change: "plugins/parcel/assets/**"
---

# Parcel branding

`parcel-mark.svg` is the approved two-sheet Parcel mark, copied from the Parcel site's `public/parcel-mark.svg`. The outlines and sheet interiors are transparent; there is no white fill.

`logo.png` is the site's square, transparent 512 × 512 export (`public/brand/icon-512.png`), with balanced padding and blue ink (`#10567d`). It is the icon for the OpenAI listing and composer and can be uploaded as the logo for the Claude directory submission. Use this icon without adding a wordmark at small sizes.

The OpenAI compatibility manifest references `./assets/logo.png` for both `interface.logo` and `interface.composerIcon`. When preparing a portable ChatGPT submission manifest, retain those paths under `extensions.com.openai.interface`; include the `assets/` directory in the upload. This change supplies branding assets, not a complete submission bundle.

Claude's documented plugin manifest has no logo field. Keep the PNG in the package and select it in the directory submission flow where a logo is requested. Do not add an unsupported manifest field.

To refresh the branding, copy both files from the approved Parcel site assets and run `node scripts/validate.mjs` from this repository's root. Do not redraw or alter the sheet spacing here.

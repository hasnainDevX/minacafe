# Mina brand and asset guide

## Palette
Ivory #F3ECDA (base), butter #F4EDBE (soft accent), peach #EFD5BE (secondary surface),
cocoa #4A2E1C (headings/borders), burgundy #601E1C (strong accent/footer), ink #000000 (body).
Tailwind tokens: bg-ivory, bg-butter, bg-peach, bg-cocoa, bg-burgundy, text-ink, etc.

## Background classes
- mina-stripes mina-paper: ivory/peach broad stripes with subtle static grain.
- mina-stripes mina-stripes-butter mina-paper: ivory/butter.
- mina-stripes mina-stripes-burgundy: strong burgundy stripes; put text on a solid panel.
- mina-paper can also be applied to solid brand-colour sections.
- Override --stripe-width and --paper-grain-opacity per section if needed.
- /brand-preview is a noindex design review route, not the final homepage.
- Preview uses system typography; final Romie/Source Sans font integration is separate.

## Asset folders
- public/images/products/: nine old-site AI placeholder images. Not verified photographs.
- public/images/brand/: existing Mina logo.
- public/images/textures/: supplied paper references plus original SVG grain used by CSS.
- public/images/decorations/: supplied paper frames and tape.
- app/assets/archive/legacy-illustrations/: old-site decorative SVGs, preserved but not used.
- app/assets/archive/reference-dividers/: supplied SVG dividers, preserved unchanged.
- app/fonts/: existing downloaded fonts and licence files preserved unchanged.
- app/assets/manifest.json records each original name, new location, SHA256 and status.
- app/assets/index.js provides stable image paths for future components.

## Replace placeholders
Replace the relevant public/images/products file with the real photograph using the same
name/extension, or change its single entry in app/assets/index.js if the format changes.
Update manifest status to real-photo once replaced. Do not label AI placeholders as real photos.
Use consented original images for the final launch. Keep source/licence records for supplied
decorative references. No asset was deleted or recompressed during organization.


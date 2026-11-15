# Mina product cutouts

Nine transparent PNG layout drafts, created with the built-in image_gen editing tool from the existing product photographs. Each output is 1254 x 1254 with alpha transparency. Originals remain untouched.

AI editing reconstructed some packaging, labels, ingredient arrangements and text. These are not pixel-faithful background removals; review against the originals before final use. They have intentionally not replaced the site's current photographs.

Use `productCutouts` from `app/assets/cutouts.js` when ready. Use `object-contain` for the image and set the background colour on its parent. Existing JPGs remain suitable for hero and editorial imagery.

## Prompt set
Use case: background-extraction. Extract only the single central product, including complete lid/cap and base. Genuine alpha transparency. Remove backdrop, table, props, other products, decorative splashes and ground shadow. Preserve original proportions, contents, camera angle, label artwork and text as closely as possible; do not redesign. Centre complete subject on square canvas with about 8% padding. No coloured background or checkerboard. Ecommerce cutout for CSS-coloured cards.

Subject-specific instructions:
- Strawberry, creamy, chocolate and mango: bottle only; remove loose fruit, nuts, chocolate and milk splashes.
- Fresh fruit glass: cup, contained fruit and full wooden skewer; remove loose fruit and background cups.
- Chicken salad: black bowl, ingredients and dressing cup inside; remove wooden serving board.
- Nut & Nectar mini box: small lidded tub and contained nuts; remove airborne nuts and honey ring.
- Nut & Nectar cup: lidded cup and contents; remove external honey ribbons and props.
- Nut & Nectar bucket: tall bucket, white carrying handle and contents; remove external honey ribbons and props.

source-map.json records the generated file corresponding to each product.
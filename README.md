# Feral Dungeon Master

Local-first playground for the Scene Designer, Inventory catalog, and Hypnotics tools.

## Development

- `npm install`—installs Vite and any other dependencies.
- `npm run dev`—starts Vite's dev server so you can preview the static HTML files under `public/`.
- `npm run build`—emits the production bundle into `dist/` (upload either `dist/` or `public/` to Cloudflare Pages depending on your workflow).

All three HTML files live under `public/` and still keep their inline CSS/JS for now:

- `public/index.html`
- `public/inventory.html`
- `public/hypnosis.html`

No additional tooling is required—everything runs locally via npm scripts.

## Shared data model

Every app (inventory, scene designer, hypnosis) references a single lightweight schema:

- `InventoryItem` — `{ id, name, cat, layer, zones[], anchors[], supports{anchor:[use]}, effects[], safety[], conflicts[], tags[], config.access[] }`
- `SceneNode` — `{ zoneId, allowedCats[], requiredAnchors[], blockedEffects[] }`
- `ConsentProfile` — `{ zoneId, status (green/yellow/red), notes }`

Category defaults (available categories, layers, anchors, placement hints, and functions) live in the JSON blob embedded in `public/inventory.html` and are exposed at runtime via `window.fdmInventory.getCategoryMeta(cat)`. Use `window.fdmInventory.getItems()` or `getItemsByZone(zoneId)` to hydrate other modules without duplicating storage logic.

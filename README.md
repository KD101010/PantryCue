# PantryCue

**Cook what you have.**

PantryCue is a mobile-first family cooking app that turns food already in the kitchen into useful meal ideas. The live family beta is deployed at [kd101010.github.io/PantryCue](https://kd101010.github.io/PantryCue/).

## Version 0.6.0

- 110 original base recipes, including a much larger set of gluten-free, dairy-free, vegetarian, and vegan meals
- Dietary-aware recipe adaptation instead of hiding otherwise compatible recipes
- Strict matching for labeled gluten-free, dairy-free, vegan, and other specialty ingredients
- Detailed guided Cooking Mode with setup, equipment, heat levels, oven rack guidance, doneness checks, safe temperatures, resting, and serving steps
- Cross-browser live barcode decoding powered by ZXing, barcode-photo scanning, and manual UPC / EAN entry
- Open Food Facts product lookup with dietary labels preserved during ingredient normalization
- Photo capture with an explicit confirmation-first workflow
- Pantry, fridge, freezer, grocery, favorites, substitutions, serving scaling, voice entry, and local device persistence

## Dietary matching

PantryCue adapts compatible recipes to the preferences selected in setup or Settings. For example, the standard spaghetti recipe becomes a gluten-free version and requires gluten-free pasta and gluten-free marinara to count as available.

The matching engine does not count ordinary pasta as gluten-free pasta or ordinary cream as dairy-free cream. Packaged foods and allergy-sensitive products should still be checked by the cook, and the app displays that reminder with adapted recipes.

## Photo workflow

Automatic visual food recognition is not enabled in this family beta. A user can capture a photo, keep it visible as a reference, and confirm the foods before PantryCue adds anything. This avoids pretending that an unavailable vision service recognized an item.

## Local development

Use Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Vite usually starts at `http://localhost:5173`. It is configured with `host: true` for testing from another device on the same network.

## Required checks

```bash
npm test
npm run typecheck
npm run build
```

The production output is written to `dist/`.

## Deployment

GitHub Actions is the deployment source of truth. Pull requests run the reproducible install and production build. Pushes to `main` build and deploy to GitHub Pages.

Keep the Vite base path unchanged:

```ts
base: '/PantryCue/'
```

Camera access requires HTTPS on deployed builds. The current GitHub Pages URL provides that secure context.

## Project structure

```text
src/
├── components/       Reusable mobile UI and barcode scanner
├── data/             Ingredient catalog, substitutions, and 110 recipes
├── hooks/            Local persistence
├── lib/              Normalization, dietary adaptation, matching, cooking guide
├── services/         Open Food Facts and optional USDA lookup
├── App.tsx            Main application flows
├── styles.css         Mobile-first visual system
└── version.ts         Visible app version
```

## Content and safety principles

- Recipes are original PantryCue family-beta content.
- Do not copy recipes from commercial sites or books without appropriate rights.
- Do not label ordinary food as suitable for a dietary preference when a specialty label is required.
- Keep confirmation in every future photo-recognition workflow.
- Optimize for clarity, large tap targets, and a short path to a useful dinner idea.

See [FAMILY_TESTING.md](FAMILY_TESTING.md) for the current phone test checklist.

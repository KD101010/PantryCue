# PantryCue

**Cook what you have.**

PantryCue is a phone-first cooking app that turns the food already in a kitchen into useful meal ideas. Users can type ingredients, speak them, scan packaged-food barcodes, save favorites, build a grocery list from missing ingredients, see substitutions they already have, and follow a focused step-by-step cooking mode.

This repository is the **family beta** build. It is intentionally designed to be simple enough for a first-time user to understand without instructions.

## What is included

- Phone-first responsive interface
- Custom PantryCue app icon and branding
- One-time setup for serving count and food preferences
- Pantry, fridge, and freezer inventory
- Free-text ingredient entry
- Common ingredient normalization and aliases
- Browser voice input with graceful fallback
- Live camera barcode scanning when the browser supports `BarcodeDetector`
- Manual UPC entry fallback
- Open Food Facts product lookup for barcodes
- Recipe matching based on foods already available
- “Make it now” and “Almost there” recommendations
- “Use soon” prioritization
- Smart substitutions based on what is already in the kitchen
- One-tap add-missing-items grocery workflow
- Grocery checklist and move-to-kitchen workflow
- Saved recipes
- Recipe and ingredient search
- Time filters
- Dietary preference filtering
- Serving-size adjustment
- Full-screen cooking mode
- Photo capture beta with a confirmation-first workflow
- Local persistence for the family beta
- PWA manifest and phone home-screen icons
- Original PantryCue family-beta recipe catalog

## Important beta choices

### Photo scanning

The photo flow is present, but automatic visual food recognition is **not pretending to work**. Users can capture a photo and confirm the visible foods manually. This is deliberate. A future vision backend should suggest items and then use the same confirmation screen before adding anything to the kitchen.

### Food coverage

PantryCue does not restrict users to a small hard-coded ingredient list. Any food can be entered as free text. The local catalog and alias layer improve matching for common foods, while the project also includes an optional USDA FoodData Central service for broader food search later.

### Recipe content

The recipes included here were written specifically for the PantryCue beta. Do not copy commercial cookbook recipes or website instructions into the repository without appropriate rights or licensing.

## Run PantryCue locally

You need Node.js and npm installed.

```bash
npm install
npm run dev
```

Vite will print a local address, usually:

```text
http://localhost:5173
```

To test from a phone on the same Wi-Fi network, Vite is configured with `host: true`. Use the network address shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production files will be created in:

```text
dist/
```

## Optional USDA food search key

The current family beta works without an API key.

If you later want to enable USDA FoodData Central search, copy `.env.example` to `.env.local` and add a key:

```text
VITE_USDA_API_KEY=your_key_here
```

Never commit `.env.local` or real secret keys to GitHub.

# Create a brand-new GitHub repository

PantryCue should be its own repository. Do not add it as a branch inside the Form workout app repository.

Your GitHub should look roughly like this:

```text
Your GitHub account
├── form
│   └── workout app
└── pantrycue
    └── this cooking app
```

## Easiest method: GitHub website plus Git commands

### 1. Create the empty repository

1. Sign in to GitHub.
2. In the upper-right corner, click the **+** button.
3. Click **New repository**.
4. Repository name: `pantrycue`
5. Description: `Cook what you have. A smart kitchen and recipe app.`
6. Set visibility to **Private** while the family beta is being tested.
7. Do **not** add a README, `.gitignore`, or license on GitHub because this project already contains those files.
8. Click **Create repository**.

GitHub will then show the URL for the new empty repository.

### 2. Put this project in its own folder

Unzip the PantryCue project so the folder contains files such as:

```text
pantrycue/
├── README.md
├── package.json
├── public/
└── src/
```

Open a terminal inside that folder.

### 3. Initialize Git

```bash
git init
git add .
git commit -m "Initial PantryCue family beta"
git branch -M main
```

### 4. Connect the folder to the new GitHub repository

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/pantrycue.git
git push -u origin main
```

Refresh the GitHub page. The PantryCue files should now appear in the new repository.

## GitHub Desktop method

If you prefer GitHub Desktop:

1. Create the empty `pantrycue` repository on GitHub using the steps above.
2. Open GitHub Desktop.
3. Choose **File > Add Local Repository**.
4. Select the unzipped PantryCue folder.
5. If GitHub Desktop says the folder is not a Git repository, choose the option to create one there.
6. Commit all files with the message `Initial PantryCue family beta`.
7. Publish or push the repository to the `pantrycue` repository you created.

## Suggested branch workflow after the first push

Keep `main` as the stable family-test version. For larger changes, create a new branch first:

```bash
git checkout -b feature/photo-scan
```

After a feature is tested, merge it into `main` through GitHub.

# Deploy it for friends and family

A GitHub repository stores the code. To give testers a normal website link, deploy the repository through a service such as Vercel, Netlify, or Cloudflare Pages.

For a typical Vite deployment:

```text
Build command: npm run build
Output directory: dist
```

For phone features such as camera access, use an HTTPS deployment. Browsers generally require a secure context for camera APIs.

## Before sending the link out

Run through this short check:

```bash
npm install
npm run build
```

Then test on at least:

- iPhone Safari
- Android Chrome if available
- One desktop browser

Test adding foods, refreshing the page, barcode fallback, grocery items, saved recipes, and cooking mode.

See `FAMILY_TESTING.md` for a ready-to-use testing checklist.

# Project structure

```text
pantrycue/
├── public/
│   ├── pantrycue-logo.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   │   ├── BarcodeScanner.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Brand.tsx
│   │   ├── Icon.tsx
│   │   ├── Modal.tsx
│   │   └── RecipeCard.tsx
│   ├── data/
│   │   ├── ingredientCatalog.ts
│   │   ├── recipes.ts
│   │   └── substitutions.ts
│   ├── hooks/
│   │   └── usePersistentState.ts
│   ├── lib/
│   │   ├── ingredients.ts
│   │   └── matching.ts
│   ├── services/
│   │   ├── foodDataCentral.ts
│   │   └── openFoodFacts.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── docs/
│   └── DATA_STRATEGY.md
├── .env.example
├── .gitignore
├── FAMILY_TESTING.md
├── README.md
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

# Family beta roadmap

The recommended next stages are:

1. Deploy this family beta and collect real feedback.
2. Fix any friction in the first 60 seconds of use.
3. Add cloud accounts and household syncing.
4. Add a server-side recipe and ingredient database.
5. Add real photo recognition with a confirmation screen.
6. Add expiration dates or purchase dates only if testers actually want them.
7. Add shared grocery lists.
8. Add meal history and personalized recipe ranking.
9. Expand the recipe catalog through original recipes and properly licensed providers.
10. Prepare App Store and Google Play packaging only after the web/PWA workflow is proven.

## Product principle

PantryCue should never make users complete a full pantry inventory before giving them value. A user should be able to add five foods and immediately get useful meal ideas.

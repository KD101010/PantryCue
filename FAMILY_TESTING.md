# PantryCue 0.6.0 Family Test

Please test with real food you have at home. The goal is to find anything that makes choosing or cooking dinner harder than it should be.

## Priority regression: gluten-free spaghetti

- [ ] In Settings, select **Gluten-free**.
- [ ] Add `gluten-free spaghetti`, `gluten-free pasta sauce`, `ground beef`, `garlic`, and `Italian seasoning`.
- [ ] Confirm **Spaghetti with Meat Sauce** appears under **Make it now**.
- [ ] Open it and confirm the dietary card says it was adjusted for gluten-free cooking.
- [ ] Confirm the ingredients say **Gluten-free spaghetti** and **Gluten-free marinara sauce**.
- [ ] Start Cooking Mode and confirm it has detailed setup, heat, timing, 160°F beef guidance, draining, sauce, and serving steps.

## Barcode test

- [ ] Tap **Barcode** and allow camera access.
- [ ] Hold a UPC or EAN barcode inside the frame until it is detected.
- [ ] If live scanning is difficult, use **Scan a barcode photo**.
- [ ] Test manual number entry as the final fallback.
- [ ] Confirm a product with “gluten-free,” “dairy-free,” or “vegan” on its name keeps that label after it is added.
- [ ] Report the product, phone, browser, and whether the failure was camera scanning or product lookup.

## Cooking Mode test

- [ ] Open the Ingredients drawer from Cooking Mode.
- [ ] Confirm every ingredient name and amount is visible on the light cards.
- [ ] Change servings before starting and confirm Cooking Mode uses the selected serving count.
- [ ] Move through every step and confirm the screen remains readable without clipped text.
- [ ] Check that oven recipes give a temperature and rack position.
- [ ] Check that meat and fish recipes give a doneness temperature where appropriate.
- [ ] Flag any direction that assumes equipment you do not have or leaves you unsure what heat to use.

## Photo + confirm test

- [ ] Tap **Photo + confirm** and take or choose a kitchen photo.
- [ ] Confirm the photo preview appears.
- [ ] Enter the visible foods, including dietary labels, and add them.
- [ ] Confirm the foods appear in the selected pantry, fridge, or freezer area.

Automatic food recognition is not enabled yet. This is an explicit confirmation-first beta, not a simulated recognition result.

## General five-minute test

- [ ] Add at least five foods by typing.
- [ ] Add one food by voice if supported.
- [ ] Compare **Make it now** and **Almost there** results.
- [ ] Search for a meal or ingredient in Recipes.
- [ ] Save a recipe.
- [ ] Add missing ingredients to Grocery.
- [ ] Check off a grocery item and move it into the kitchen.
- [ ] Mark an ingredient **Use soon** and review prioritized meals.
- [ ] Refresh the page and confirm your data remains.

## Please include in every bug report

1. Phone model and operating system
2. Browser and browser version
3. Dietary preferences selected
4. Exact food names entered
5. What you expected
6. What happened instead
7. A screenshot if the problem is visual

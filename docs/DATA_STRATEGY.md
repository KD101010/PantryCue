# PantryCue Data Strategy

## Ingredient coverage

PantryCue should not rely on a single static ingredient list. The recommended production model has four layers:

1. **Canonical ingredient layer**
   - Human-friendly food concepts such as `chicken breast`, `cheddar cheese`, `rice`, and `marinara sauce`.
   - Used by the recipe matching engine.

2. **Alias and normalization layer**
   - Maps phrases such as `hamburger meat` to `ground beef`.
   - Maps product descriptions containing recognizable food terms to useful recipe concepts when possible.

3. **Packaged-food layer**
   - Barcode lookup through Open Food Facts or another licensed commercial provider.
   - Store the original product name and brand, while also mapping it to a canonical ingredient for recipe matching.

4. **Authoritative food search layer**
   - USDA FoodData Central can be used to enrich generic food search and nutrition data.
   - Nutrition should remain separate from the core recipe matching model so the app can still function without it.

## Recipe coverage

The family beta contains original PantryCue recipes so the product can be tested without licensing risk.

A production recipe catalog should combine:

- Original PantryCue recipes
- Properly licensed recipe datasets or providers
- Structured user-created recipes
- Carefully controlled recipe generation for gaps, if added later

Do not scrape or republish cookbook or recipe-site instructions without permission.

## Matching philosophy

A recipe should be placed into one of three useful states:

- **Make it now:** All required ingredients are available, including an acceptable substitution.
- **Almost there:** One or two required ingredients are missing.
- **Not a good match yet:** Too many important ingredients are missing.

Optional garnishes should not block a recipe from being considered makeable.

## Substitutions

Substitutions need context. A swap that works in a sauce may not work in baking. The beta uses a conservative substitution library for common savory cooking cases. Production should eventually support recipe-specific substitution rules.

## Photo recognition

Automatic photo recognition should never directly edit inventory. The production flow should be:

```text
Photo
  -> Suggested visible foods
  -> User confirmation
  -> Canonical ingredient mapping
  -> Add to kitchen
```

Confidence thresholds should decide whether an item is preselected, shown as uncertain, or omitted.

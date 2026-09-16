# sorrego-net

Eleventy scaffold — homepage only, for review.

## Run locally
```
npm install
npm start        # dev server at http://localhost:8080
```

## Build
```
npm run build     # outputs to _site/
```

## What's here
- `src/pages/home.md` — homepage content (frontmatter drives everything: logo, intro, about, something-else)
- `src/_includes/layouts/base.njk` — shared header/search/footer, used by every page
- `src/_includes/layouts/home.njk` — homepage-specific chip-stack nav + 3-column grid
- `src/_data/categories.yml` — single source of truth for nav chip colors and labels
- `src/assets/css/style.css` — all styling, incl. the 1:1:2 column grid and Coral Pixels logo font

## Open item
`categories.yml` flags one placeholder: "Things I've Done" wraps three
sub-themes with three different colors (sand/sage/lavender-grey), so its
own homepage chip color (#D8E8F4) is a guess, not a locked decision.

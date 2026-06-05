---
name: slide-deck
description: Author slides for Wes's hand-rolled HTML slide engine (the slides/ folder). Use when adding, editing, or restructuring slides. Layouts are automatic via CSS :has() — pick elements, not classes.
---

# Slide deck

A hand-rolled HTML slide engine (a customized fork of Google's old `html5slides`
template) served by Vite. Every slide is one `<article>`. **Layouts are automatic:**
CSS `:has()` selectors in `slides/styles.css` look at what's inside each article and
choose the layout. You almost never add a layout class — you just put the right
elements in the article and it lays itself out.

## Where things live (all under `slides/`)

| File | What it is |
|---|---|
| `index.html` | The deck. One `<article>` per slide, inside `<section class="slides layout-regular template-default">`. |
| `styles.css` | Engine CSS, theme tokens, and all the `:has()` auto-layouts. **Edit layouts here.** |
| `slides.js` | Navigation engine (keys, touch, builds, hash). Rarely touched. |
| `autoplay.ts` | IntersectionObserver that plays/loops `<video>`s on-screen, pauses them off-screen. |
| `spanran-wrap.ts` | Per-letter title animation. Currently disabled (commented out in `index.html`). |
| `images/ fonts/ icons/` | Assets. `images/` holds the 3 background textures the theme needs (`AU-FG-Texture4-8K.jpg`, `AU-FG-Texture7-8K.jpg`, `grunge.png`) plus any slide images you add. Put videos in a `videos/` folder and reference them from root (`/videos/x.mp4`). |

## Run it

```bash
cd slides
npm start          # Vite dev server on http://localhost:6969
npm run build      # builds to docs/
```

Note: `vite.config.js` sets `base` (e.g. `/AI-and-JavaScript/`) for GitHub Pages —
**that's per-talk, update it when you start a new deck.** So is `<title>` in
`index.html` and `name` in `package.json`.

## Navigating (from `slides.js`)

- Advance: → / space / enter / PgDn. Back: ← / backspace / PgUp.
- Click the left/right 150px edge of the screen to go back/forward; swipe on touch.
- URL hash is the 1-based slide number (`#3`) — deep-linkable and survives reload.
- `onslideenter` / `onslideleave` attributes run on an article; `slideenter` /
  `slideleave` DOM events also fire. Use these to trigger demos.
- `<iframe>`s are lazy: their `src` is swapped to `about:blank` while off-screen.

## The layout cookbook

Pick the snippet whose elements match what you want. The CSS detects it automatically —
no layout class needed unless noted. Rule locations are in `styles.css`.

### Big statement — heading only
A lone heading is centered and scaled up to ~200px. (`styles.css` ~278–283)
```html
<article>
  <h1>A big statement</h1>
</article>
```

### Heading + body — title with supporting text/list
Heading followed by `p`/`ul`/`ol`/`blockquote`/`pre` → centered with a gap. (`styles.css` ~265–270)
```html
<article>
  <h2>Heading</h2>
  <p>Supporting sentence.</p>
</article>
```

### Full-bleed media — image or video only
An article whose only child is an `<img>` or `<video>` fills the whole slide,
`object-fit: contain`, padding removed. (`styles.css` ~214–223)
```html
<article>
  <img src="./images/your-image.png" alt="" />
</article>
```

### Title + media
A heading (or `.title`) followed by a single image/video → title row on top, media
fills the rest. (`styles.css` ~231–246)
```html
<article>
  <h2>Pose Detection</h2>
  <video src="/videos/reps.mp4" autoplay muted loop></video>
</article>
```

### Side by side
Two columns. Add `even` for a strict 1fr/1fr split; if a column has a heading the
grid auto-narrows the first column. Text is right-aligned by default. (`styles.css` ~295–332)
```html
<article>
  <div class="side-by-side even">
    <div>
      <p class="center">CPU — 7008ms</p>
      <img src="./images/caption-cpu.png" alt="" class="wide" />
    </div>
    <div>
      <p class="center">WebGPU — 576ms</p>
      <img src="./images/caption-webgpu.png" alt="" class="wide" />
    </div>
  </div>
</article>
```

### Columns
Flex row, vertically centered, big gap. Good for "X + Y" comparisons. (`styles.css` ~285–289)
```html
<article>
  <div class="columns">
    <div><h2>Web<br/>Dev<br/>Courses</h2></div>
    <div>+</div>
    <div><img src="..." /></div>
  </div>
</article>
```

### Grid
Auto-fit grid of items; headings span the full row. (`styles.css` ~188–207)
```html
<article class="grid">
  <h2>Logos</h2>
  <img src="..." /> <img src="..." /> <img src="..." />
</article>
```

### Jumble — categorized lists
Two-column grid of grouped lists; each `<strong>` renders as a green chip. (`styles.css` ~375–400)
```html
<article>
  <p>Lots of things, grouped.</p>
  <ul class="jumble">
    <li><strong>Category</strong>
      <ul><li>Item</li><li>Item</li></ul>
    </li>
  </ul>
</article>
```

## Conventions & helper classes

- **`img.fit`** — `width/height: 100%`, `object-fit: contain`. Use on images that
  should fill their cell. **`img.wide`** — `width: 100%`, auto height.
- **`.center`** — centers text (often on a caption `<p>` above an image).
- **`mark`** — green highlight on inline text. **`em`** — emphasis, used inside headings.
- **Section marker**: `<p class="reason">Reason #1</p>` then an `<h1>` — the recurring
  "Reason #N" divider. `.reason` is plain `<p>` styling, just a semantic hook.
- **`<p class="sub">`** — subtitle line. Plain `<p>` styling, semantic only.
- **Builds (progressive reveal)** — put `class="build"` on a container (usually a `<ul>`).
  On load `slides.js` (`makeBuildLists`) hides each child with `to-build`; each advance
  reveals one more (`buildNextItem`) before moving to the next slide. Non-obvious but very
  useful for revealing bullet points one at a time.
  ```html
  <ul class="build">
    <li>First reveal</li>
    <li>Second reveal</li>
  </ul>
  ```
- **`style="--display: block"`** on an `<article>` overrides the default `display: grid`
  (used on the title slide so the title/subtitle stack normally).
- **Inline `style="font-size: 15rem"` / `style="height: 900px"` is normal here.** One-off
  sizing per slide is the accepted pattern — don't refactor it into classes.

## Video pattern

```html
<video src="/videos/x.mp4" autoplay muted loop></video>
```
`autoplay.ts` observes every `<video>` and plays + resets it to `currentTime = 0` when it
scrolls into view, pausing it when it leaves. Keep all four attributes and put the file in
`videos/` (referenced from the site root with a leading `/`).

## Theme notes

- Engine rules, fonts, theme tokens, typography, media helpers, auto-layouts, and slide
  components all live in `styles.css`.
- The deck uses local NDK fonts from `slides/fonts/ndk/`.
- The current theme is dark editorial paper: `--paper`/`--paper-2` are dark, and
  `--ink`/`--ink-soft` are light foreground colors.
- The texture overlay is retired for this theme; `.overlay` is intentionally hidden.

## Add a new slide (recipe)

1. Copy the scaffold `<article>` closest to what you want from `index.html`.
2. Drop in your content and let CSS pick the layout — match the element shape from the cookbook.
3. Only add a class (`fit`, `wide`, `side-by-side`, `build`, …) or an inline `style` when the
   automatic layout isn't doing what you want.
4. For media, use `images/` or `videos/`; videos need `autoplay muted loop` and a `/videos/...` src.
5. `npm start` and arrow through to check it.

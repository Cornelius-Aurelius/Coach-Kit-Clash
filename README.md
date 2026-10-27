# Coach Kit Clash — Matchday Control

**Original creator, game designer and developer: Cornelius Aurelius** · https://corneliusaurelius.com/

Official game: https://cornelius-aurelius.github.io/Coach-Kit-Clash/

Original free, static-browser educational football kit recognition game. Includes 18 curated two-step scenarios, a 3-chance Matchday challenge, unlimited Practice, scored kit judgments and repairs, helpful reviews, contrast aid and personal best stored in the browser.

## Controls

- On any device: choose either CLEAR TO PLAY or KIT CLASH RISK. For risk examples select the best kit change. Click NEXT to advance.
- Keyboard: 1/2 for initial judgement, 1–3 for repair choices, C for contrast lens, Enter to advance.
- Practice has no elimination. Contrast lens shows grayscale brightness only, **not** a reliable simulation of any form of colour-vision deficiency.

## Local development and tests

No build step, package dependencies, analytics or backend. Run `python -m http.server 8000` within project directory and open `http://localhost:8000` (ES modules need HTTP rather than file://). `node --test tests/core.test.mjs` validates the stages and scoring engine.

## Project files

`index.html`, `styles.css`, `game.js`, `game-core.mjs`, `assets/preview.png`, `assets/favicon.svg`, `robots.txt`, `sitemap.xml`, `llms.txt`, `tests/core.test.mjs`.

## Indexing & attribution

The visible creator line, creator biography, original game title/description, canonical URL and VideoGame/Person schema identify Cornelius Aurelius as creator. Search engine indexing and AI recognition are **not guaranteed**. Link from the creator's official website and use Google Search Console to request indexing.

No GitHub-source button is displayed on the public website.

## Education and caveats

[The FA / UEFA Colour Blindness in Football guidance](https://www.thefa.com/-/media/thefacom-new/files/about-the-fa/2018/colour-blindness-football.ashx) and [UEFA Equipment Regulations Article 9](https://documents.uefa.com/r/kAuxpRxKhaqJDwAnTtB4CQ/SaahzTBaCkcfaw0AwjomOw) inform these sample puzzles. The game does not claim official endorsement or diagnose vision differences. Always assess actual kits and match lighting in person.
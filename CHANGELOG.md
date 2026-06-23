# Changelog

## 2026-06-12

- Created unified `String Lab` app from the existing Fretboard Lab and Cuatro Lab static apps.
- Added five-section iPad UI: Practice, Progressions / Loop, Guitar CAGED, Cuatro, Aerobics.
- Refactored shared note, interval, chord, scale, Roman numeral, voicing, and storage logic into ES modules.
- Preserved guitar fretboard training, CAGED positions, open chords, progressions, global metronome, and offline PWA support.
- Imported Puerto Rican cuatro tuning, course model, course-aware rendering, and voicing generation.
- Added scale-over-chord recommendations with concise target-tone explanations.
- Added loop-pedal companion practice cards and random generator.
- Added Puerto Rican cuatro chord encyclopedia with three-course, full five-course, compact, nearby, inversion, and guitar-to-cuatro translation views.
- Added guitar aerobics randomizer, daily workouts, tab notation, picking guidance, tempo ladders, and local progress.
- Added versioned service worker cache `string-lab-v1`.
- Added iPad README, install page, and offline smoke checklist.
- Added `app.js` local-file fallback so `index.html` works when opened directly in Chrome.
- Restyled the unified app to more closely match the optimized Fretboard Lab and Cuatro Lab visual language.
- Split full fretboards into 0-12 and 12-24 sections so the 12th fret remains visible.
- Added all-notes toggles for Practice, Guitar CAGED, and Cuatro fretboards.
- Strengthened selected-shape highlighting for CAGED and chord voicing practice.
- Moved the 10-minute Aerobics workout under the random exercise and added Puerto Rican cuatro exercises.
- Reworked Practice, Guitar CAGED, and Cuatro to use one horizontal fretboard with 0-5, 0-12, and full-range views.
- Simplified Progressions / Loop scale suggestion cards to chord, Roman numeral, and target tones only.
- Added clickable Cuatro voicing highlights on the course-aware fretboard.
- Rearranged Aerobics workouts into side-by-side cards.
- Changed Practice chord mode so chord tones are highlighted only after selecting a specific voicing shape.
- Replaced the Cuatro Nearby panel with the guitar-to-cuatro Translate panel.
- Fixed Aerobics workout card wrapping so 10-minute workouts display cleanly.
- Upgraded the app shell for installable offline PWA use on iPad with PNG icons, Safari metadata, a refreshed manifest, and a versioned service worker cache.
- Added IndexedDB-first storage with localStorage fallback, JSON backup/restore controls, saved loop practice plans, and persisted settings.
- Added the Loop Companion tab with genre/key/difficulty/scale/bar controls, fretboard target maps, compact target-tone cards, rhythm and lead prompts, a tab-local Web Audio click, saved plans, printable card export, JSON export, and MIDI export.
- Added `INSTALL-IPAD.md` with HTTPS hosting, GitHub Pages, Cloudflare Pages, Netlify, and offline smoke-test instructions.
- Added built-in MIDI-style chord progression preview playback for Progressions / Loop and Loop Companion, with current-chord highlighting.
- Changed Loop Companion playback and MIDI export so they follow the displayed comping rhythm instead of sustained block chords.
- Removed the older duplicated loop practice card from the Progressions tab; Loop Companion now owns practice-plan generation.

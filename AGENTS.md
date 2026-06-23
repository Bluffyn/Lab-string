# String Lab Maintenance Notes

- Keep the app static and dependency-free unless there is a strong reason to add a build step.
- Put shared music math in `src/core/`.
- Put instrument-specific tuning and physical-layout data in `src/instruments/`.
- Keep feature modules small and tablet-oriented.
- Update `service-worker.js` whenever adding or renaming a required file.
- Update tests when chord, scale, progression, or voicing rules change.
- Do not add remote scripts, fonts, analytics, or login flows.

# pensjonskalkulator — instruks for Claude Code-økter

Norsk pensjonskalkulator (React + TS + Vite, klient-side, ingen backend). Dette er det
**offentlige kilde-/mirror-repoet** (rekrutterer-synlig). Les `README.md`.

## Koblinger (les FØR endringer)
- **Produksjonssiden bygger IKKE fra dette repoet.** `www.evers.no/pensjonskalkulator/`
  bygges fra en in-tree-kopi `pensjonskalkulator-src/` i `ValiantEvers.github.io` (egen
  GitHub Actions-workflow). Dette repoet er den frittstående speil-/portefølje-kopien.
- De to holdes manuelt i synk ved de (~årlige) sats-/G-oppdateringene — **sist synket
  2026-10-18** (rolig drakt; satsene 2026-10-15: 2026-satser inkl. revidert budsjett juni 2026; før det 2026-07-04: 2025-satser
  korrigert + FV-annuitet for negative avkastninger; oppdater datoen her ved neste synk). **Eneste tilsiktede
  forskjell:** `vite.config.ts` her bygger til `dist/`; site-kopien til `../pensjonskalkulator`.
  Ikke «fiks» bort denne forskjellen.
- Skrifter (Manrope/Fraunces) serveres fra forelder-siten; en standalone-klon faller tilbake
  på systemfonter (kun visuelt avvik).

## Konvensjoner (gjelder alle endringer)
- Norsk i innhold, engelske identifikatorer. Datoer ISO 8601. Aldri Co-Authored-By-trailer.
- Commit-prefiks: `feat:` / `fix:` / `docs:` / `chore:`. `git pull --rebase origin main` før push.
- Caveats er førsteklasses: modellforenklinger står i footer-disclaimer + README.
- Visuelt: krem-familiens rolige regler (2026-10-17): ingen glød-skyer, fargede skygger,
  sperrede versaler, inn-animasjoner eller lange tankestreker i synlig tekst. Kilden er
  `DESIGN.md` i site-repoet, «Calm rules for the cream family».
- Kontrast (2026-10-18, samme endring i begge kopier): aksent `#FF4E2F` (var `#FF5436`) for store
  tall og flater, `accent-ink` `#B03418` for liten aksenttekst, `muted` `#766F65` uten
  `/80`- eller `/70`-varianter. Kilden er `DESIGN.md`, «Contrast in the cream family».

## Modell og årlig vedlikehold
- All matematikk i `src/pension-engine.ts` (React-fri, testbar isolert). Skattemodell i
  `src/lib/tax.ts` (2026-satser).
- **Årlig oppdatering:** `G_DEFAULT` (mai), skattekonstanter (statsbudsjett i desember, og
  sjekk revidert budsjett i juni — det endret pensjonsfradraget i 2026),
  delingstall per kohort.
- Skatt anvendes på **real** inntekt (unngår bracket creep over 30+ år) — ikke endre uten grunn.

## Bygg / verifisering
- `npm run build` (Vite), `npm run typecheck`, og `node src/sanity-test.mjs` (forventet:
  brutto 24–34k / netto 22–30k for defaults, realkroner). CI (`ci.yml`) kjører typecheck +
  sanity-test + build på hver push. Deps vedlikeholdes av delt Renovate-preset
  (`ValiantEvers/renovate-config`, `renovate.json` siden 2026-07-23).

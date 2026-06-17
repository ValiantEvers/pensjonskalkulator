# pensjonskalkulator — instruks for Claude Code-økter

Norsk pensjonskalkulator (React + TS + Vite, klient-side, ingen backend). Dette er det
**offentlige kilde-/mirror-repoet** (rekrutterer-synlig). Les `README.md`.

## Koblinger (les FØR endringer)
- **Produksjonssiden bygger IKKE fra dette repoet.** `www.evers.no/pensjonskalkulator/`
  bygges fra en in-tree-kopi `pensjonskalkulator-src/` i `ValiantEvers.github.io` (egen
  GitHub Actions-workflow). Dette repoet er den frittstående speil-/portefølje-kopien.
- De to holdes manuelt i synk ved de (~årlige) sats-/G-oppdateringene. **Eneste tilsiktede
  forskjell:** `vite.config.ts` her bygger til `dist/`; site-kopien til `../pensjonskalkulator`.
  Ikke «fiks» bort denne forskjellen.
- Skrifter (Manrope/Fraunces) serveres fra forelder-siten; en standalone-klon faller tilbake
  på systemfonter (kun visuelt avvik).

## Konvensjoner (gjelder alle endringer)
- Norsk i innhold, engelske identifikatorer. Datoer ISO 8601. Aldri Co-Authored-By-trailer.
- Commit-prefiks: `feat:` / `fix:` / `docs:` / `chore:`. `git pull --rebase origin main` før push.
- Caveats er førsteklasses: modellforenklinger står i footer-disclaimer + README.

## Modell og årlig vedlikehold
- All matematikk i `src/pension-engine.ts` (React-fri, testbar isolert). Skattemodell i
  `src/lib/tax.ts` (2025-satser).
- **Årlig oppdatering:** `G_DEFAULT` (mai), skattekonstanter (statsbudsjett i desember),
  delingstall per kohort.
- Skatt anvendes på **real** inntekt (unngår bracket creep over 30+ år) — ikke endre uten grunn.

## Bygg / verifisering
- `npm run build` (Vite), `npm run typecheck`, og `node src/sanity-test.mjs` (forventet:
  brutto 24–34k / netto 22–30k for defaults, realkroner). CI (`ci.yml`) kjører typecheck +
  sanity-test + build på hver push.

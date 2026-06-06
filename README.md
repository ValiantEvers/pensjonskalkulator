# Pensjonskalkulator

[![CI](https://github.com/ValiantEvers/pensjonskalkulator/actions/workflows/ci.yml/badge.svg)](https://github.com/ValiantEvers/pensjonskalkulator/actions/workflows/ci.yml)

**Norsk pensjonskalkulator — estimer månedlig pensjon (folketrygd + tjenestepensjon + IPS/ASK) med en
transparent, fullt dokumentert modell.**
A client-side Norwegian pension calculator: project your monthly retirement income with a transparent,
fully documented model. No backend, no tracking, no cookies — every calculation runs in the browser.

**Live:** [www.evers.no/pensjonskalkulator](https://www.evers.no/pensjonskalkulator/)

## Hva / What

Kalkulatoren tar lønn, alder, pensjonsalder og spareinput og projiserer månedlig pensjon i både
nominelle og reale (dagens kjøpekraft) kroner, brutt ned per kilde (folketrygd, tjenestepensjon, IPS,
ASK), med et skattejustert nettotall og en gap-analyse mot ønsket dekningsgrad.

*The tool takes salary, age, retirement age and savings inputs and projects monthly pension in both
nominal and real kroner, broken down by source, with a tax-adjusted net figure and a gap analysis.*

## Høydepunkter / Highlights

- **Isolert, testbar beregningsmotor** — [`src/pension-engine.ts`](src/pension-engine.ts) har null
  React-avhengigheter og kjøres headless. En selvstendig sanity-test
  ([`src/sanity-test.mjs`](src/sanity-test.mjs)) verifiserer at standardinput gir pensjon i forventet
  intervall, og kjøres i CI.
- **Nøye real/nominell-modellering** — all compounding skjer nominelt; deflatering til realkroner kun
  for visning og skatt. Skatt anvendes på realinntekt for å unngå bracket creep over 30+ år.
- **Norsk skattemodell (2025)** — [`src/lib/tax.ts`](src/lib/tax.ts): alminnelig inntekt, trygdeavgift,
  trinnskatt, pensjonsskattefradrag og separat ASK-gevinstbeskatning.
- **Delbar URL-state** — alle inputs synkes til query-stringen
  ([`src/lib/useUrlState.ts`](src/lib/useUrlState.ts)), så et scenario kan deles via lenke.
- **Tilgjengelighet** — respekterer `prefers-reduced-motion`
  ([`src/lib/usePrefersReducedMotion.ts`](src/lib/usePrefersReducedMotion.ts)).
- **TypeScript + typecheck og bygg i CI** — `tsc --noEmit` og produksjons-build på hver push.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Recharts. Ingen backend, ingen runtime-tjenester.

## Kjøre lokalt / Run locally

```bash
npm install
npm run dev                # http://localhost:5173/pensjonskalkulator/
npm run typecheck          # TypeScript-validering uten emit
npm run build              # produksjons-build til dist/
npm run preview            # forhåndsvis bygget lokalt
node src/sanity-test.mjs   # verifiser beregningsmotoren isolert
```

`sanity-test.mjs` verifiserer at standardinput (alder 30, pensjon 67, lønn 650 000, OTP 2 %) gir
månedlig pensjon i intervallet 22 000–30 000 kr (realkroner).

## Modell / Model

All matematikk og dokumentasjon ligger i [`src/pension-engine.ts`](src/pension-engine.ts), bevisst
skrevet uten React-avhengigheter slik at den er testbar isolert. Sentrale antakelser:

- Lønnsvekst og inflasjon oppgis nominelt; realavkastning oppgis real.
  Nominell avkastning = `(1 + real) × (1 + inflasjon) − 1`.
- **Folketrygd:** 18,1 % av min(lønn, 7,1 G) per år, indeksert med lønnsvekst; månedlig =
  beholdning / delingstall / 12 (NAVs delingstall inkluderer en indekseringsforutsetning, så
  rentebærende utbetaling på toppen ville dobbelttelt).
- **Tjenestepensjon, IPS, ASK:** compound nominelt i opptjeningsfasen; utbetaling som rentebærende
  annuitet (PMT) med en lavere realavkastning (default 2 %) for å reflektere de-risking.
- **Privat AFP:** forenklet til 0,8 × G / 12 livsvarig.
- **Garantipensjon-floor** (1,9 × G/år) anvendes på folketrygd-utbetalingen for lavinntektsbrukere.
- G per 1. mai 2025 = 130 160 kr (oppdateres årlig i `pension-engine.ts`).

### Skattemodell

[`src/lib/tax.ts`](src/lib/tax.ts) er kalibrert mot **2025-satser**: alminnelig inntekt (22 %),
trygdeavgift (5,1 % på pensjon), trinnskatt (5 brakketter), pensjonsskattefradrag (maks 33 250,
3-trinns nedtrapping), og ASK beskattet separat som aksjegevinst (37,84 % på gevinst-andelen). Skatten
anvendes på **real** pensjonsinntekt — det forutsetter at skattebraktene justeres med inflasjon, en
standard antakelse for langsiktig modellering (ellers ville bracket creep dramatisk overestimert
skatten på nominell verdi i 2063).

### Forenklinger (dokumentert)

Skjermingsfradrag på ASK ignoreres; hele pensjonen antas tatt ut samme år; uføretrygd, offentlig
sektor-AFP og kapitalinntekt utenom ASK er ikke modellert. Alt dette står også i appens egen
disclaimer. **Skattesystemet endres årlig — verifiser mot siste statsbudsjett før kalkulatoren brukes
som beslutningsgrunnlag.**

## Tilgjengelighet / Accessibility

100 % klient-side (ingen cookies, ingen tracking). Animasjoner respekterer `prefers-reduced-motion`.
Tallformat følger `nb-NO`. Fargekontrast er ikke formelt WCAG-AA-revidert — nevnt ærlig.

## Deploy

Live på [www.evers.no/pensjonskalkulator](https://www.evers.no/pensjonskalkulator/), bygget med Vite
(`base: '/pensjonskalkulator/'`) og servert via GitHub Pages under evers.no-domenet.

Dette er det publiserte kilde-repoet. Produksjonssiden ([evers.no](https://www.evers.no)) bygger i dag
fra en speilet kopi som ligger in-tree i site-repoet; de to holdes i synk ved de (~årlige)
sats-/G-oppdateringene. Eneste tilsiktede forskjell mot den kopien: `vite.config.ts` her bygger til
`dist/` (standalone) i stedet for site-mappens deploy-sti.

**Skrifter:** Manrope/Fraunces serveres fra forelder-siten (`/fonts/` på evers.no-roten), ikke buntet i
dette repoet. En standalone-klon vil derfor falle tilbake på systemfonter — fullt funksjonelt, kun et
visuelt avvik.

## Lisens / License

MIT — see [LICENSE](LICENSE).

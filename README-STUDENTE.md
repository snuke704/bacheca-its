# Bacheca avvisi ITS — repository di partenza

Questo repository **funziona già**: si installa, passa i test e costruisce il sito.
Quello che manca è l'**automazione**. La costruisci tu durante la prova.

## Prova che funziona (fallo per primo, 2 minuti)

```bash
npm ci          # installa esattamente le dipendenze del lockfile (zero dipendenze esterne)
npm test        # 5 test, devono passare tutti
npm run build   # genera dist/index.html + dist/style.css + dist/versione.json
```

Apri `dist/index.html` nel browser: vedi la bacheca con 5 avvisi.
Se qualcosa non funziona **dillo subito al docente**: non è parte della prova.

## Cosa c'è dentro

| Percorso | A cosa serve |
|---|---|
| `data/avvisi.json` | i dati: gli avvisi con codice, data, categoria, titolo, priorità |
| `src/build.mjs` | il generatore: legge il JSON e scrive `dist/` |
| `test/bacheca.test.mjs` | 5 test sul contenuto e sulla pagina generata |
| `site/style.css` | il foglio di stile, copiato in `dist/` dalla build |
| `script/sniffa-segreti.sh` | cerca credenziali finite nel repo; esce con 1 se ne trova |
| `.github/workflows/ci.yml` | **da completare** — i gate sulla pull request |
| `.github/workflows/release.yml` | **da completare** — pubblicazione, approvazione, rollback |

## Come si lavora

I due workflow sono **incompleti**: cerca i commenti `# TODO n`.
Ogni TODO corrisponde a una voce della griglia di valutazione, quindi vale punti da solo:
anche se non li finisci tutti, quelli fatti valgono.

Consiglio: **un TODO alla volta**, commit, e guarda la tab *Actions*.
Un job rosso ti dice la riga esatta. Non completare tutto e poi sperare.

## Regole

- Repository **pubblico** (senza, gli *environment* con approvazione non si possono creare).
- Puoi consultare i tuoi appunti, il deck delle lezioni e la documentazione ufficiale di GitHub.
- Non condividere codice o risposte con altri studenti.

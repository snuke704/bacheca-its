link repo: https://github.com/snuke704/bacheca-its

A2. node_modules/ e dist/ non devono essere versionati perché contengono rispettivamente dipendenze installate e file generati dalla build; entrambi possono essere ricreati usando npm ci e npm run build.

A3. https://github.com/snuke704/bacheca-its/pull/1

A4. Avere la CI verde significa che i controlli automatici sono stati superati. Avere un gate significa che quei controlli sono obbligatori: se non sono verdi, GitHub impedisce il merge su `main`.

B1.
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

B2
- name: Cerca credenziali nel repository
  run: bash script/sniffa-segreti.sh

B3
- name: Installa le dipendenze dal lockfile
  run: npm ci

- name: Esegui i test
  run: npm test

- name: Costruisci il sito
  run: npm run build

B4.
- name: Smoke test sull'artefatto
  run: |
    test -s dist/index.html || { echo "dist/index.html mancante o vuoto"; exit 1; }
    attesi=$(node -e "console.log(JSON.parse(require('fs').readFileSync('data/avvisi.json','utf8')).avvisi.length)")
    trovati=$(grep -c '<td class="cod">' dist/index.html || true)
    echo "Avvisi attesi: $attesi"
    echo "Righe trovate: $trovati"
    if [ "$trovati" -ne "$attesi" ]; then
      echo "Il numero di righe non corrisponde al numero di avvisi"
      exit 1
    fi

B5.
- name: Carica l'artefatto del sito
  uses: actions/upload-artifact@v4
  with:
    name: sito
    path: dist/

B6.
È stata introdotta temporaneamente una regressione che rimuoveva un avviso dalla pagina generata.
Il gate che ha bloccato la pull request è stato:
`Gate applicazione - dipendenze, test, build`
La regressione è stata successivamente rimossa e la pull request di prova non è stata unita.


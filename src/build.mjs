// Generatore statico della Bacheca avvisi. Zero dipendenze: solo Node.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const OUT = "dist";

/** Ordina per priorita crescente e, a parita di priorita, per data crescente. */
export function ordina(avvisi) {
  return [...avvisi].sort((a, b) => a.priorita - b.priorita || a.data.localeCompare(b.data));
}

/** Conta quanti avvisi ci sono per ogni categoria. */
export function perCategoria(avvisi) {
  const conto = {};
  for (const a of avvisi) conto[a.categoria] = (conto[a.categoria] ?? 0) + 1;
  return conto;
}

export function render(dati, versione) {
  const avvisi = ordina(dati.avvisi);
  const righe = avvisi
    .map(
      (a) => `      <tr>
        <td class="cod">${a.codice}</td>
        <td class="data">${a.data}</td>
        <td class="cat">${a.categoria}</td>
        <td>${a.titolo}</td>
      </tr>`
    )
    .join("\n");
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bacheca avvisi - ${dati.istituto}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Bacheca avvisi</h1>
    <p class="sub">${dati.istituto} - ${dati.corso}</p>
  </header>
  <main>
    <table>
      <thead><tr><th>Codice</th><th>Data</th><th>Categoria</th><th>Avviso</th></tr></thead>
      <tbody>
${righe}
      </tbody>
      <tfoot><tr><td colspan="3">Avvisi pubblicati</td><td class="tot">${avvisi.length}</td></tr></tfoot>
    </table>
  </main>
  <footer>
    <p>build <code>${versione}</code></p>
  </footer>
</body>
</html>
`;
}

function main() {
  const dati = JSON.parse(readFileSync("data/avvisi.json", "utf8"));
  // VERSIONE la imposta la pipeline (serve per il rollback: e la versione che si
  // sta ripubblicando, non quella dell'ultimo commit su main). In locale: "locale".
  const versione = process.env.VERSIONE || process.env.GITHUB_SHA?.slice(0, 7) || "locale";
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/index.html`, render(dati, versione));
  writeFileSync(
    `${OUT}/versione.json`,
    JSON.stringify(
      { versione, avvisi: dati.avvisi.length, categorie: perCategoria(dati.avvisi) },
      null,
      2
    )
  );
  if (existsSync("site/style.css")) cpSync("site/style.css", `${OUT}/style.css`);
  console.log(`OK  ${OUT}/index.html  (${dati.avvisi.length} avvisi, build ${versione})`);
}

// main() parte solo se il file e lanciato direttamente, non quando i test lo importano.
// pathToFileURL gestisce spazi nel percorso e i backslash di Windows.
const lanciatoDirettamente =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (lanciatoDirettamente) main();

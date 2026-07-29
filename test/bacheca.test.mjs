import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ordina, perCategoria, render } from "../src/build.mjs";

const dati = JSON.parse(readFileSync("data/avvisi.json", "utf8"));

test("il file degli avvisi ha i campi obbligatori", () => {
  for (const a of dati.avvisi) {
    for (const campo of ["codice", "data", "categoria", "titolo", "priorita"]) {
      assert.ok(a[campo] !== undefined, `manca ${campo} in ${a.codice}`);
    }
  }
});

test("i codici degli avvisi sono unici", () => {
  const codici = dati.avvisi.map((a) => a.codice);
  assert.equal(new Set(codici).size, codici.length);
});

test("ordina mette prima la priorita piu alta", () => {
  const primo = ordina(dati.avvisi)[0];
  const minima = Math.min(...dati.avvisi.map((a) => a.priorita));
  assert.equal(primo.priorita, minima);
});

test("perCategoria conta tutti gli avvisi", () => {
  const conto = perCategoria(dati.avvisi);
  const somma = Object.values(conto).reduce((a, b) => a + b, 0);
  assert.equal(somma, dati.avvisi.length);
});

test("la pagina generata contiene una riga per ogni avviso", () => {
  const html = render(dati, "test");
  for (const a of dati.avvisi) assert.ok(html.includes(a.titolo), `manca ${a.codice}`);
});

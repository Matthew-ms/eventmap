// Data-entry helper: `node scripts/geocode.ts 京都市東山区祇園町北側625 …` → lat, lon per address.
// Uses the GSI (国土地理院) address search. Paste the result into data/venues.ts and eyeball the pin.
import { politeFetch } from './fetch.ts';

for (const address of process.argv.slice(2)) {
  let hit: { geometry: { coordinates: [number, number] }; properties: { title: string } } | undefined;
  for (let attempt = 0; attempt < 3 && !hit; attempt++) {
    const text = await politeFetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(address)}`)
      .then((r) => r.text())
      .catch(() => ''); // connection resets happen; retry below
    if (text) hit = JSON.parse(text)[0]; // the API sometimes answers with an empty body; retry
    if (!text) await new Promise((r) => setTimeout(r, 3000));
  }
  console.log(hit ? `${address}\t${hit.geometry.coordinates[1]}, ${hit.geometry.coordinates[0]}\t(${hit.properties.title})` : `${address}\tNOT FOUND`);
}

async function loadPaintings() {
  // Paste your published Google Sheet CSV link here
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/YOUR_PUBLISHED_LINK/pub?gid=0&single=true&output=csv";

  try {
    const response = await fetch(sheetUrl);
    const csvText = await response.text();

    // Convert CSV to array of objects
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    const paintings = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i] ? values[i].trim() : '';
      });
      return obj;
    });

    return paintings;
  } catch (error) {
    console.error("Error loading paintings from Google Sheet:", error);
    return [];
  }
}

function renderPaintings(paintings) {
  const container = document.getElementById('paintings-grid');
  if (!container) return;

  container.innerHTML = '';

  paintings.forEach(p => {
    const card = document.createElement('div');
    card.className = 'painting-card';
    card.innerHTML = `
      <div class="painting-img">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${p.title}</h3>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const paintings = await loadPaintings();
  renderPaintings(paintings);
});
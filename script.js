async function loadPaintings() {
  // ← Put your published Google Sheet CSV link here
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/YOUR_PUBLISHED_ID/pub?gid=0&single=true&output=csv";

  try {
    const response = await fetch(sheetUrl);
    const csvText = await response.text();

    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const paintings = lines.slice(1).map(line => {
      // Simple CSV split (works for most cases)
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });
      return obj;
    });

    return paintings;
  } catch (error) {
    console.error("Error loading paintings:", error);
    return [];
  }
}

function renderPaintings(paintings) {
  const container = document.getElementById('paintings-grid');
  if (!container) return;

  container.innerHTML = '';

  paintings.forEach(p => {
    // Accept both "img" and "imageurl" column names
    const imageUrl = p.img || p.imageurl || p.Imageurl || '';

    if (!imageUrl) return; // skip rows without image

    const card = document.createElement('div');
    card.className = 'painting-card';
    card.innerHTML = `
      <div class="painting-img">
        <img src="${imageUrl}" alt="${p.title || 'Painting'}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${p.title || 'Untitled'}</h3>
      </div>
    `;
    container.appendChild(card);
  });
}
async function loadPaintings() {
  // ↓↓↓ PASTE YOUR PUBLISHED CSV LINK BETWEEN THE QUOTES ↓↓↓
  const sheetUrl = "PASTE_YOUR_PUBLISHED_CSV_LINK_HERE";

  try {
    const response = await fetch(sheetUrl + "&t=" + Date.now());
    const csvText = await response.text();

    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const paintings = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.every(v => v === '')) continue; // skip empty rows

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Only show rows that have a real Cloudinary image
      if (row.imageurl && row.imageurl.includes('res.cloudinary.com')) {
        paintings.push({
          title: row.title || 'Untitled',
          img: row.imageurl,
          category: row.category || ''
        });
      }
    }

    return paintings;
  } catch (error) {
    console.error("Failed to load paintings:", error);
    return [];
  }
}

function renderPaintings(paintings) {
  const container = document.getElementById('paintings-grid');
  
  if (!container) {
    console.error("No element with id='paintings-grid' found");
    return;
  }

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
  console.log("Loaded paintings:", paintings.length);
  renderPaintings(paintings);
});

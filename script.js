async function loadPaintings() {
  // ← PASTE YOUR PUBLISHED GOOGLE SHEET CSV LINK HERE
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/YOUR_PUBLISHED_LINK/pub?gid=0&single=true&output=csv";

  try {
    const response = await fetch(sheetUrl + "&_=" + new Date().getTime()); // prevents caching
    const csvText = await response.text();

    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const paintings = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      // Skip completely empty rows
      if (values.every(v => !v)) continue;

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Only include rows that have a real Cloudinary image
      const imageUrl = row.imageurl || row.img || '';
      
      if (imageUrl.includes('res.cloudinary.com')) {
        paintings.push({
          title: row.title || 'Untitled',
          img: imageUrl,
          category: row.category || '',
          dimensions: row.dimensions || ''
        });
      }
    }

    return paintings;
  } catch (error) {
    console.error("Error loading paintings:", error);
    return [];
  }
}

function renderPaintings(paintings) {
  const container = document.getElementById('paintings-grid');
  if (!container) {
    console.error("Could not find element with id='paintings-grid'");
    return;
  }

  container.innerHTML = '';

  if (paintings.length === 0) {
    container.innerHTML = '<p>No paintings found.</p>';
    return;
  }

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

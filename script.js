// Load paintings from paintings.json
async function loadPaintings() {
  try {
    const response = await fetch('paintings.json');
    if (!response.ok) {
      throw new Error('Could not load paintings.json');
    }
    const paintings = await response.json();
    return paintings;
  } catch (error) {
    console.error('Error loading paintings:', error);
    return [];
  }
}

function renderPaintings(paintings, containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const toRender = limit ? paintings.slice(0, limit) : paintings;

  toRender.forEach(p => {
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

// Run when the page loads
document.addEventListener('DOMContentLoaded', async function() {
  const paintings = await loadPaintings();

  // Featured paintings on the homepage (shows first 8)
  if (document.getElementById('featured-grid')) {
    renderPaintings(paintings, 'featured-grid', 8);
  }

  // Full collection on the shop page
  if (document.getElementById('shop-grid')) {
    renderPaintings(paintings, 'shop-grid');
  }
});
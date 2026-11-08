const STORAGE_KEY = 'voxel-mods-v1';
const cover = (id, w = 900, h = 620) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;
const seedMods = [
  { id: 'aetherbound', name: 'Aetherbound', category: 'Adventure', version: '1.21.x', author: 'Lunar Studio', downloads: 284300, rating: 4.9, ratings: 1284, featured: true, description: 'Take to the skies in a breathtaking new dimension. Discover floating islands, forgotten temples, and creatures that call the clouds home.', image: cover('photo-1462331940025-496dfbfc7564'), screenshots: [cover('photo-1462331940025-496dfbfc7564', 1000, 650), cover('photo-1446776811953-b23d57bd21aa', 1000, 650), cover('photo-1464822759023-fed622ff2c3b', 1000, 650)], tags: ['Dimensions', 'Exploration'], added: 5 },
  { id: 'create-beyond', name: 'Create: Beyond', category: 'Technology', version: '1.21.x', author: 'Kinetic Works', downloads: 192600, rating: 4.8, ratings: 862, featured: true, description: 'Build bigger, bolder contraptions with a stellar collection of mechanical components, moving platforms, and creative tools.', image: cover('photo-1451187580459-43490279c0fa'), screenshots: [cover('photo-1451187580459-43490279c0fa', 1000, 650), cover('photo-1517976487492-5750f3195933', 1000, 650), cover('photo-1519608487953-e999c86e7455', 1000, 650)], tags: ['Machines', 'Automation'], added: 4 },
  { id: 'wildlands', name: 'Wildlands', category: 'Worldgen', version: '1.20.4', author: 'Moss & Moon', downloads: 153800, rating: 4.9, ratings: 973, featured: true, description: 'A living, breathing world overhaul. Wander through lush biomes, ancient forests, and landscapes made for getting wonderfully lost.', image: cover('photo-1448375240586-882707db888b'), screenshots: [cover('photo-1448375240586-882707db888b', 1000, 650), cover('photo-1470770841072-f978cf4d019e', 1000, 650), cover('photo-1472396961693-142e6e269027', 1000, 650)], tags: ['Biomes', 'Nature'], added: 3 },
  { id: 'tiny-tweaks', name: 'Tiny Tweaks', category: 'Quality of Life', version: '1.21.x', author: 'pixelperfect', downloads: 98100, rating: 4.7, ratings: 612, featured: false, description: 'Little touches, big difference. A thoughtfully crafted set of quality-of-life improvements that keeps the vanilla magic intact.', image: cover('photo-1518837695005-2083093ee35b'), screenshots: [cover('photo-1518837695005-2083093ee35b', 1000, 650), cover('photo-1470252649378-9c29740c9fa8', 1000, 650)], tags: ['Vanilla+', 'Utility'], added: 2 },
  { id: 'moonstone-manor', name: 'Moonstone Manor', category: 'Building', version: '1.21.x', author: 'Studio Spruce', downloads: 74600, rating: 4.8, ratings: 418, featured: false, description: 'Give every build a little more wonder. Explore a curated palette of dreamy blocks, elegant details, and luminous decor.', image: cover('photo-1518709268805-4e9042af9f23'), screenshots: [cover('photo-1518709268805-4e9042af9f23', 1000, 650), cover('photo-1518005020951-eccb494ad742', 1000, 650)], tags: ['Decor', 'Blocks'], added: 1 },
  { id: 'starlight-odyssey', name: 'Starlight Odyssey', category: 'Adventure', version: '1.20.1', author: 'Orbit Games', downloads: 62100, rating: 4.6, ratings: 327, featured: false, description: 'Follow the signal beyond the stars. A story-rich exploration mod with mysterious ruins, handcrafted quests, and a galaxy to uncover.', image: cover('photo-1419242902214-272b3f66ee7a'), screenshots: [cover('photo-1419242902214-272b3f66ee7a', 1000, 650), cover('photo-1534796636912-3b95b3ab5986', 1000, 650)], tags: ['Quests', 'Space'], added: 0 }
];
let mods = loadMods();
let activeFilter = 'All';
let searchTerm = '';
let toastTimer;

function loadMods() {
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : structuredClone(seedMods); }
  catch { return structuredClone(seedMods); }
}
function saveMods() { localStorage.setItem(STORAGE_KEY, JSON.stringify(mods)); }
function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function formatDownloads(n) { return n >= 1e6 ? `${(n / 1e6).toFixed(1)}m` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 100000 ? 0 : 1)}k` : String(n); }
function categoryClass(category) { return category.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''); }
function stars(rating) { return `<span class="rating-stars" aria-label="${rating} out of 5 stars">★</span><span class="rating-number">${Number(rating).toFixed(1)}</span>`; }
function modCard(mod, featured = false) {
  return `<article class="mod-card ${featured ? 'featured-card' : ''}" data-id="${escapeHTML(mod.id)}"><button class="card-cover" data-view="${escapeHTML(mod.id)}" aria-label="View ${escapeHTML(mod.name)}"><img src="${escapeHTML(mod.image || cover('photo-1462331940025-496dfbfc7564'))}" alt="" loading="lazy"><span class="category-badge ${categoryClass(mod.category)}">${escapeHTML(mod.category)}</span>${mod.featured ? '<span class="featured-badge">✦ Featured</span>' : ''}<span class="cover-arrow">↗</span></button><div class="card-body"><div class="card-title-row"><div><h3>${escapeHTML(mod.name)}</h3><p class="card-author">by ${escapeHTML(mod.author || 'Community creator')}</p></div>${stars(mod.rating)}</div><p class="card-description">${escapeHTML(mod.description)}</p><div class="card-footer"><span class="version-pill">${escapeHTML(mod.version)}</span><span class="download-count">↓ ${formatDownloads(mod.downloads || 0)}</span><button class="view-link" data-view="${escapeHTML(mod.id)}">View mod <span>→</span></button></div></div></article>`;
}
function render() {
  const filtered = mods.filter(m => (activeFilter === 'All' || m.category === activeFilter) && (!searchTerm || `${m.name} ${m.author} ${m.category} ${(m.tags || []).join(' ')}`.toLowerCase().includes(searchTerm)));
  const sorted = [...filtered].sort((a,b) => {
    const mode = document.getElementById('sortSelect')?.value || 'popular';
    if (mode === 'rating') return b.rating - a.rating;
    if (mode === 'newest') return (b.added || 0) - (a.added || 0);
    if (mode === 'name') return a.name.localeCompare(b.name);
    return b.downloads - a.downloads;
  });
  document.getElementById('featuredGrid').innerHTML = mods.filter(m => m.featured).slice(0, 3).map(m => modCard(m, true)).join('') || '<p class="no-featured">No featured mods yet. Add one in Creator Studio.</p>';
  document.getElementById('modsGrid').innerHTML = sorted.map(m => modCard(m)).join('');
  document.getElementById('emptyState').classList.toggle('hidden', sorted.length > 0);
  document.getElementById('modCount').textContent = mods.length;
  document.getElementById('allCount').textContent = mods.length;
  renderAdmin();
}
function renderAdmin() {
  const downloads = mods.reduce((sum, m) => sum + Number(m.downloads || 0), 0);
  const avg = mods.length ? (mods.reduce((sum, m) => sum + Number(m.rating || 0), 0) / mods.length).toFixed(1) : '0.0';
  document.getElementById('statsGrid').innerHTML = `<div class="stat-card"><span>YOUR MODS</span><strong>${mods.length}</strong><small>Published in the universe</small></div><div class="stat-card"><span>TOTAL DOWNLOADS</span><strong>${formatDownloads(downloads)}</strong><small>Across all your listings</small></div><div class="stat-card"><span>AVERAGE RATING</span><strong>★ ${avg}</strong><small>Community-approved</small></div>`;
  document.getElementById('adminTableBody').innerHTML = mods.map(adminRow).join('');
  document.getElementById('mobileAdminList').innerHTML = mods.map(m => `<div class="mobile-mod-row"><div class="mobile-mod-heading"><img src="${escapeHTML(m.image)}" alt=""><div><strong>${escapeHTML(m.name)}</strong><small>${escapeHTML(m.category)} · ${escapeHTML(m.version)}</small></div></div><div class="mobile-mod-actions"><button class="button button-quiet" data-edit="${escapeHTML(m.id)}">Edit</button><button class="button button-danger" data-delete="${escapeHTML(m.id)}">Delete</button></div></div>`).join('');
}
function adminRow(m) { return `<tr><td><div class="table-mod"><img src="${escapeHTML(m.image)}" alt=""><div><strong>${escapeHTML(m.name)}</strong><small>by ${escapeHTML(m.author || 'Community creator')}</small></div></div></td><td><span class="category-badge ${categoryClass(m.category)}">${escapeHTML(m.category)}</span></td><td>${stars(m.rating)}</td><td>${formatDownloads(m.downloads || 0)}</td><td><button class="feature-toggle ${m.featured ? 'is-featured' : ''}" data-feature="${escapeHTML(m.id)}" aria-label="Toggle featured">${m.featured ? '✦ Yes' : '— No'}</button></td><td><div class="table-actions"><button data-edit="${escapeHTML(m.id)}">Edit</button><button class="delete-action" data-delete="${escapeHTML(m.id)}">Delete</button></div></td></tr>`; }
function showToast(message) { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
function showMod(id) {
  const m = mods.find(item => item.id === id); if (!m) return;
  const shots = m.screenshots?.length ? m.screenshots : [m.image];
  document.getElementById('modDetailContent').innerHTML = `<div class="detail-cover"><img id="galleryMain" src="${escapeHTML(shots[0])}" alt="${escapeHTML(m.name)} screenshot"><span class="category-badge ${categoryClass(m.category)}">${escapeHTML(m.category)}</span><button class="gallery-arrow gallery-prev" aria-label="Previous screenshot">‹</button><button class="gallery-arrow gallery-next" aria-label="Next screenshot">›</button><div class="gallery-count">1 / ${shots.length}</div></div><div class="gallery-thumbs">${shots.map((s,i) => `<button class="gallery-thumb ${i===0?'selected':''}" data-shot="${i}" aria-label="Show screenshot ${i+1}"><img src="${escapeHTML(s)}" alt=""></button>`).join('')}</div><div class="detail-content"><div class="detail-title-row"><div><div class="eyebrow">${escapeHTML(m.category)} · MINECRAFT ${escapeHTML(m.version)}</div><h2 id="modalTitle">${escapeHTML(m.name)}</h2><p class="card-author">Created by ${escapeHTML(m.author || 'Community creator')}</p></div><div class="detail-rating">${stars(m.rating)}<small>${Number(m.ratings || 0).toLocaleString()} ratings</small></div></div><p class="detail-description">${escapeHTML(m.description)}</p><div class="detail-tags">${(m.tags || []).map(t => `<span>#${escapeHTML(t)}</span>`).join('')}</div><div class="detail-stats"><span><strong>↓ ${formatDownloads(m.downloads || 0)}</strong><small>downloads</small></span><span><strong>${escapeHTML(m.version)}</strong><small>latest version</small></span><span><strong>${Number(m.rating).toFixed(1)} / 5</strong><small>community rating</small></span></div><div class="rate-row"><span>Enjoying this mod?</span><div class="rate-stars" aria-label="Rate this mod">${[1,2,3,4,5].map(n => `<button data-rate="${n}" aria-label="Rate ${n} stars">★</button>`).join('')}</div><small>Rate it</small></div><button class="button button-primary detail-download" id="downloadButton">Get this mod <span>↗</span></button><p class="download-hint">Downloads are a demo action in this prototype.</p></div>`;
  const modal = document.getElementById('modModal'); modal.dataset.modId = id; modal.dataset.shots = JSON.stringify(shots); modal.dataset.index = '0'; modal.classList.remove('hidden'); document.body.classList.add('modal-open');
}
function setGallery(index) { const modal = document.getElementById('modModal'); const shots = JSON.parse(modal.dataset.shots || '[]'); if (!shots.length) return; index = (index + shots.length) % shots.length; modal.dataset.index = index; document.getElementById('galleryMain').src = shots[index]; document.querySelector('.gallery-count').textContent = `${index + 1} / ${shots.length}`; document.querySelectorAll('.gallery-thumb').forEach((el,i) => el.classList.toggle('selected', i === index)); }
function closeModal(modal) { modal.classList.add('hidden'); document.body.classList.remove('modal-open'); }
function openForm(id = null) {
  const m = mods.find(item => item.id === id); const form = document.getElementById('modForm'); form.reset(); document.getElementById('formTitle').textContent = m ? 'Edit your mod' : 'Add a mod'; document.getElementById('saveModButton').textContent = m ? 'Save changes' : 'Save mod';
  document.getElementById('modId').value = m?.id || ''; document.getElementById('formName').value = m?.name || ''; document.getElementById('formCategory').value = m?.category || 'Adventure'; document.getElementById('formVersion').value = m?.version || '1.21.x'; document.getElementById('formDescription').value = m?.description || ''; document.getElementById('formImage').value = m?.image || ''; document.getElementById('formScreenshots').value = (m?.screenshots || []).join(', '); document.getElementById('formFeatured').checked = Boolean(m?.featured);
  document.getElementById('formModal').classList.remove('hidden'); document.body.classList.add('modal-open');
}
function setAdmin(open) { document.getElementById('adminView').classList.toggle('hidden', !open); document.querySelector('.site-main').classList.toggle('hidden', open); document.querySelector('.admin-trigger').classList.toggle('active', open); window.scrollTo({top: 0, behavior: 'smooth'}); }

document.addEventListener('click', event => {
  const view = event.target.closest('[data-view]'); if (view) showMod(view.dataset.view);
  if (event.target.closest('#adminToggle')) setAdmin(true);
  if (event.target.closest('#backToSite')) setAdmin(false);
  if (event.target.closest('#addModButton')) openForm();
  const edit = event.target.closest('[data-edit]'); if (edit) openForm(edit.dataset.edit);
  const del = event.target.closest('[data-delete]'); if (del) { const m = mods.find(x => x.id === del.dataset.delete); if (m && confirm(`Delete “${m.name}”? This cannot be undone.`)) { mods = mods.filter(x => x.id !== m.id); saveMods(); render(); showToast('Mod removed from your universe.'); } }
  const feature = event.target.closest('[data-feature]'); if (feature) { const m = mods.find(x => x.id === feature.dataset.feature); m.featured = !m.featured; saveMods(); render(); showToast(m.featured ? 'Mod featured on the home page.' : 'Mod removed from featured.'); }
  const filter = event.target.closest('[data-filter]'); if (filter) { activeFilter = filter.dataset.filter; document.querySelectorAll('.filter-chip').forEach(x => x.classList.toggle('active', x === filter)); render(); }
  const close = event.target.closest('[data-close]'); if (close) closeModal(close.closest('.modal-backdrop'));
  if (event.target.classList.contains('modal-backdrop')) closeModal(event.target);
  const shot = event.target.closest('[data-shot]'); if (shot) setGallery(Number(shot.dataset.shot));
  if (event.target.closest('.gallery-next')) setGallery(Number(document.getElementById('modModal').dataset.index) + 1);
  if (event.target.closest('.gallery-prev')) setGallery(Number(document.getElementById('modModal').dataset.index) - 1);
  const rate = event.target.closest('[data-rate]'); if (rate) { const modal = document.getElementById('modModal'); const m = mods.find(x => x.id === modal.dataset.modId); const score = Number(rate.dataset.rate); m.rating = Number((((m.rating * (m.ratings || 1)) + score) / ((m.ratings || 1) + 1)).toFixed(1)); m.ratings = (m.ratings || 0) + 1; saveMods(); render(); showMod(m.id); showToast(`Thanks for rating ${m.name}!`); }
  if (event.target.closest('#downloadButton')) showToast('Download links can be added by the creator.');
  if (event.target.closest('#clearFilters')) { activeFilter = 'All'; searchTerm = ''; document.getElementById('searchInput').value = ''; document.querySelectorAll('.filter-chip').forEach(x => x.classList.toggle('active', x.dataset.filter === 'All')); render(); }
  if (event.target.closest('#themeButton')) { document.body.classList.toggle('light-theme'); localStorage.setItem('voxel-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark'); }
});
document.getElementById('searchInput').addEventListener('input', e => { searchTerm = e.target.value.trim().toLowerCase(); render(); });
document.getElementById('sortSelect').addEventListener('change', render);
document.getElementById('modForm').addEventListener('submit', event => {
  event.preventDefault(); const id = document.getElementById('modId').value; const existing = mods.find(m => m.id === id); const name = document.getElementById('formName').value.trim(); const image = document.getElementById('formImage').value.trim() || cover('photo-1462331940025-496dfbfc7564'); const screenshotInput = document.getElementById('formScreenshots').value.trim(); const screenshots = screenshotInput ? screenshotInput.split(',').map(s => s.trim()).filter(Boolean) : (existing?.screenshots || [image]);
  const data = { id: id || `${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now().toString(36)}`, name, category: document.getElementById('formCategory').value, version: document.getElementById('formVersion').value.trim(), author: existing?.author || 'You', downloads: existing?.downloads || 0, rating: existing?.rating || 0, ratings: existing?.ratings || 0, featured: document.getElementById('formFeatured').checked, description: document.getElementById('formDescription').value.trim(), image, screenshots, tags: existing?.tags || [], added: Date.now() };
  if (existing) mods = mods.map(m => m.id === id ? data : m); else mods.unshift(data); saveMods(); render(); closeModal(document.getElementById('formModal')); showToast(existing ? 'Your mod has been updated.' : 'Your mod is now in the universe.');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(closeModal); if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.getElementById('searchInput').focus(); } });
document.getElementById('starfield').innerHTML = Array.from({length: 105}, (_,i) => { const size = Math.random() > .88 ? 3 : Math.random() > .65 ? 2 : 1; const delay = (Math.random() * 8).toFixed(2); const duration = (3 + Math.random() * 5).toFixed(2); return `<i style="--x:${Math.random()*100}%;--y:${Math.random()*100}%;--size:${size}px;--delay:-${delay}s;--duration:${duration}s"></i>`; }).join('');
if (localStorage.getItem('voxel-theme') === 'light') document.body.classList.add('light-theme');
render();

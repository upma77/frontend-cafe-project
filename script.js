// ===== MENU PAGE SCRIPT =====
// This runs only on index.html (menu page)

const menuItems = [
  {id:1, name:'Signature Espresso', cat:'coffee', emoji:'☕', price:149, rating:4.9, desc:'Rich double shot with a velvety crema and notes of dark chocolate.', badge:'popular'},
  {id:2, name:'Hazelnut Cold Brew', cat:'coffee', emoji:'🧋', price:199, rating:4.8, desc:'18-hour cold brew infused with house-made hazelnut syrup over ice.', badge:'new'},
  {id:3, name:'Honey Lavender Latte', cat:'coffee', emoji:'🌸', price:219, rating:4.7, desc:'Espresso with steamed milk, wildflower honey, and dried lavender.', badge:''},
  {id:4, name:'Cardamom Chai', cat:'tea', emoji:'🍵', price:159, rating:4.8, desc:'Masala chai brewed with fresh cardamom, ginger, and organic Darjeeling.', badge:'popular'},
  {id:5, name:'Rose Hibiscus Tea', cat:'tea', emoji:'🌹', price:149, rating:4.6, desc:'Floral cold-brew hibiscus with rose petals and a hint of honey.', badge:''},
  {id:6, name:'Matcha Mist', cat:'tea', emoji:'🍃', price:179, rating:4.7, desc:'Ceremonial-grade matcha whisked with oat milk and a touch of vanilla.', badge:'new'},
  {id:7, name:'Tiramisu Cake', cat:'dessert', emoji:'🎂', price:299, rating:4.9, desc:'Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone.', badge:'popular'},
  {id:8, name:'Crème Brûlée', cat:'dessert', emoji:'🍮', price:279, rating:4.8, desc:'Silky vanilla custard with a perfectly caramelized sugar crust.', badge:''},
  {id:9, name:'Walnut Brownie', cat:'dessert', emoji:'🍫', price:199, rating:4.7, desc:'Fudgy dark chocolate brownie loaded with toasted California walnuts.', badge:''},
  {id:10, name:'Butter Croissant', cat:'snack', emoji:'🥐', price:129, rating:4.8, desc:'Flaky all-butter croissant baked fresh every morning at 6am.', badge:'popular'},
  {id:11, name:'Avocado Toast', cat:'snack', emoji:'🥑', price:249, rating:4.6, desc:'Sourdough with smashed avocado, cherry tomatoes, and microgreens.', badge:''},
  {id:12, name:'Cheese Panini', cat:'snack', emoji:'🥪', price:219, rating:4.5, desc:'Grilled ciabatta with aged cheddar, roasted peppers, and pesto.', badge:'new'},
];

const menuImages = {
  1:'img/espresso.jpg', 2:'img/hazelnut.jpg', 3:'img/honey.webp',
  4:'img/chai.jpg', 5:'img/rose%20chai.jpg', 6:'img/Matcha%20Mist.jpg',
  7:'img/Tiramisu%20Cake.jpg', 8:'img/Cr%C3%A8me%20Br%C3%BBl%C3%A9e.webp',
  9:'img/Walnut%20Brownie.jpg', 10:'img/Butter%20Croissant.jpg',
  11:'img/Avocado%20Toast.jpg', 12:'img/Cheese%20Panini.jpg',
};

let activeFilter = 'all';
let searchQuery = '';

function getFilteredMenuItems() {
  const term = searchQuery.trim().toLowerCase();
  return menuItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.cat === activeFilter;
    const matchesSearch = !term || [item.name, item.desc, item.cat].some(v => v.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });
}

function renderBestsellers() {
  const items = menuItems.filter(item => item.badge === 'popular').slice(0, 3);
  document.getElementById('bestsellerGrid').innerHTML = items.map(item => `
    <div class="bestseller-card tilt-card">
      <div class="menu-cat">${item.cat}<span class="badge badge-popular">popular</span></div>
      <div class="menu-name">${item.name}</div>
      <div class="menu-desc">${item.desc}</div>
      <div class="bestseller-meta">
        <div class="bestseller-price">₹${item.price}</div>
        <button class="menu-add" onclick='addToCart({id:${item.id},name:"${item.name}",price:${item.price},emoji:"${item.emoji}"})' title="Add to cart">+</button>
      </div>
    </div>
  `).join('');
}

function renderMenu(filter = 'all') {
  activeFilter = filter;
  const grid = document.getElementById('menuGrid');
  const items = getFilteredMenuItems();
  if (!items.length) {
    grid.innerHTML = `<div class="menu-empty">No items match "${searchQuery.trim() || 'your search'}". Try another keyword or filter.</div>`;
    return;
  }
  grid.innerHTML = items.map(item => `
    <div class="menu-card menu-item-${item.id} tilt-card" data-cat="${item.cat}" style="animation:fadeInUp .5s ease both">
      <div class="menu-img">
        <img class="menu-photo" src="${menuImages[item.id]}" alt="${item.name}" loading="lazy">
        <div class="menu-img-shade"></div>
        <span class="menu-img-icon">${item.emoji}</span>
      </div>
      <div class="menu-body">
        <div class="menu-cat">${item.cat}${item.badge ? `<span class="badge badge-${item.badge}">${item.badge}</span>` : ''}</div>
        <div class="menu-name">${item.name}</div>
        <div class="menu-desc">${item.desc}</div>
        <div class="menu-footer">
          <div class="menu-price">₹${item.price}</div>
          <div>
            <div class="menu-stars">${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5 - Math.floor(item.rating))}</div>
            <div style="font-size:.7rem;color:var(--text-light)">${item.rating}</div>
          </div>
          <button class="menu-add" onclick='addToCart({id:${item.id},name:"${item.name}",price:${item.price},emoji:"${item.emoji}"})' title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.filter);
    setTimeout(initTilt, 100);
  });
});

// Search
const searchInput = document.getElementById('menuSearch');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderMenu(activeFilter);
    setTimeout(initTilt, 100);
  });
}

renderBestsellers();
renderMenu();

// ===== CHATBOT =====
const chatResponses = {
  'menu': () => 'We serve handcrafted ☕ Coffee, 🍵 Tea, 🍰 Desserts & 🥐 Snacks. Highlights: Hazelnut Cold Brew (₹199), Tiramisu Cake (₹299), and Cardamom Chai (₹159)!',
  'hours': () => '⏰ Mon–Fri: 7:00 AM – 10:00 PM\n⏰ Sat–Sun: 8:00 AM – 11:00 PM',
  'reserve': () => 'Visit our Reservation page to book your table! We confirm instantly. Tables go fast on weekends! 🪑',
  'location': () => '📍 42 Brewed Boulevard, Coffee Lane, Patna, Bihar 800001.',
  'offers': () => '🎁 Birthday Club members get a FREE dessert + 20% off\n• Happy Hour (3–5 PM): 15% off all beverages',
  'rewards': () => '🥉 Bronze (5 visits): Free upgrade · 🥈 Silver (15): 10% off · 🥇 Gold (30): VIP perks + free monthly cake!',
  'recommend': () => 'Try our AI Recommender page for a personalized brew suggestion ✦',
  'default': (msg) => `Thanks for reaching out! For detailed inquiries, email hello@cafeaura.in. Ask about our menu, hours, or offers!`,
};
const chatKnowledge = {
  'menu': ['menu', 'food', 'drink', 'coffee', 'tea', 'dessert', 'eat', 'order', 'what do'],
  'hours': ['hour', 'open', 'close', 'time', 'when', 'timing'],
  'reserve': ['reserv', 'table', 'book', 'seat', 'visit'],
  'location': ['where', 'address', 'location', 'direction', 'find'],
  'offers': ['offer', 'deal', 'discount', 'promo', 'happy hour', 'coupon'],
  'rewards': ['reward', 'point', 'loyalty', 'bronze', 'silver', 'gold', 'challenge', 'member'],
  'recommend': ['recommend', 'suggest', 'what should', 'best', 'popular'],
};

let chatOpen = false;
function addMsg(text, type) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, keywords] of Object.entries(chatKnowledge)) {
    if (keywords.some(kw => lower.includes(kw))) return chatResponses[key] ? chatResponses[key](msg) : '';
  }
  return chatResponses.default(msg);
}
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatWindow').classList.toggle('open', chatOpen);
  if (chatOpen && document.getElementById('chatMessages').children.length === 0) {
    setTimeout(() => addMsg('Welcome to Cafe Luma! ☕ I\'m your Luma Assistant. How can I help?', 'bot'), 300);
  }
}
function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  addMsg(msg, 'user');
  input.value = '';
  setTimeout(() => addMsg(getBotResponse(msg), 'bot'), 600);
}
function sendQuickReply(topic) {
  const map = { Menu: 'Tell me about the menu', Hours: 'What are your opening hours?', Reserve: 'How do I reserve a table?', Offers: 'What offers do you have?' };
  addMsg(map[topic], 'user');
  setTimeout(() => addMsg(getBotResponse(map[topic]), 'bot'), 600);
}

// Navbar scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 80 ? 'rgba(255,248,240,0.97)' : 'rgba(255,248,240,0.85)';
});

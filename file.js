// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Classic Wool Blazer",
        category: "men",
        price: 189.99,
        originalPrice: 229.99,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop"
    },
    {
        id: 2,
        name: "Silk Evening Dress",
        category: "women",
        price: 299.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop"
    },
    {
        id: 3,
        name: "Leather Crossbody Bag",
        category: "accessories",
        price: 149.99,
        originalPrice: 179.99,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop"
    },
    {
        id: 4,
        name: "Cashmere Sweater",
        category: "women",
        price: 249.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop"
    },
    {
        id: 5,
        name: "Slim Fit Chinos",
        category: "men",
        price: 89.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop"
    },
    {
        id: 6,
        name: "Aviator Sunglasses",
        category: "accessories",
        price: 159.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop"
    },
    {
        id: 7,
        name: "Floral Print Blouse",
        category: "women",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&h=600&fit=crop"
    },
    {
        id: 8,
        name: "Denim Jacket",
        category: "men",
        price: 139.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=600&fit=crop"
    },
    {
        id: 9,
        name: "Statement Earrings",
        category: "accessories",
        price: 49.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop"
    }
];

// ===== Cart Data =====
let cart = [];

// ===== DOM Elements =====
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const filterBtns = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletterForm');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartCount();
});

// ===== Render Products =====
function renderProducts(productsToRender) {
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="product-action-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                    <button class="product-action-btn" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="product-action-btn" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    $${product.price.toFixed(2)}
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Filter Products =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        if (category === 'all') {
            renderProducts(products);
        } else {
            const filteredProducts = products.filter(p => p.category === category);
            renderProducts(filteredProducts);
        }
    });
});

// ===== Cart Functions =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    renderCartItems();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCartItems();
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Cart Event Listeners =====
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

// ===== Mobile Menu =====
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Newsletter Form =====
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    alert(`Thank you for subscribing with email: ${email}`);
    e.target.reset();
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Make functions globally available =====
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;


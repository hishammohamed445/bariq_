// البيانات الافتراضية - جنيه مصري
const defaultProducts = [
    {
        id: 1,
        name: "باريك الذهبية",
        description: "ساعة أنيقة من الذهب عيار 18 قيراط مع سوار جلدي",
        price: 12500,
        originalPrice: 15000,
        discount: 17,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "فاخرة",
        stock: 15,
        status: "in-stock",
        features: ["ذهب عيار 18 قيراط", "سوار جلدي فاخر", "مقاومة للماء حتى 50 متر", "ضمان 3 سنوات"],
        badge: "sale"
    },
    {
        id: 2,
        name: "باريك الفضية",
        description: "ساعة فاخرة من الفضة الإيطالية مع مينا ازرق",
        price: 9500,
        originalPrice: 11000,
        discount: 14,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "كلاسيكية",
        stock: 8,
        status: "in-stock",
        features: ["فضة إيطالية", "مينا أزرق فاخر", "سوار فولاذي", "مقاومة للخدش"],
        badge: "sale"
    },
    {
        id: 3,
        name: "باريك الكلاسيكية",
        description: "ساعة كلاسيكية بتصميم رفيع وأنيق للرجال",
        price: 11500,
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "رجالية",
        stock: 0,
        status: "out-of-stock",
        features: ["تصميم رفيع وأنيق", "سوار جلد طبيعي", "ساعة سويسرية", "شاشة عرض تاريخ"],
        badge: "sold-out"
    },
    {
        id: 4,
        name: "باريك الرياضية",
        description: "ساعة رياضية متعددة الوظائف مقاومة للماء",
        price: 8500,
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "رياضية",
        stock: 22,
        status: "in-stock",
        features: ["مقاومة للماء حتى 100 متر", "عداد الخطى", "مؤقت", "شاشة لمس"],
        badge: "new"
    },
    {
        id: 5,
        name: "باريك النسائية",
        description: "ساعة نسائية فاخرة بتصميم أنيق ومميز",
        price: 7800,
        originalPrice: 9000,
        discount: 13,
        image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "نسائية",
        stock: 12,
        status: "in-stock",
        features: ["تصميم أنيق للنساء", "ألماس مرصع", "سوار فضي", "مقاومة للماء"],
        badge: "sale"
    },
    {
        id: 6,
        name: "باريك الحديثة",
        description: "ساعة ذكية بتقنيات حديثة وشاشة لمس",
        price: 14500,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "رياضية",
        stock: 18,
        status: "in-stock",
        features: ["شاشة لمس", "تتبع اللياقة", "مقاومة للماء", "بطارية 7 أيام"],
        badge: "new"
    }
];

const API_BASE = '/api';

// تحميل البيانات من LocalStorage أو استخدام البيانات الافتراضية
let products = loadFromStorage('bariq_products', defaultProducts);
let cart = loadFromStorage('bariq_cart', []);
let appliedDiscount = null;
let discountValue = 0;

// دالة لتنسيق الأرقام كمبالغ بالجنيه المصري
function formatEGP(amount) {
    return `ج.م ${amount.toLocaleString('ar-EG')}`;
}

// عناصر DOM الرئيسية
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginBtnMobile = document.getElementById('adminLoginBtnMobile');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutModalBtn = document.getElementById('checkoutModalBtn');
const cartCount = document.querySelector('.cart-count');
const productsContainer = document.getElementById('productsContainer');
const quickViewModal = document.getElementById('quickViewModal');
const closeQuickView = document.getElementById('closeQuickView');
const checkoutPage = document.getElementById('checkoutPage');
const checkoutForm = document.getElementById('checkoutForm');
const completeOrderBtn = document.getElementById('completeOrderBtn');
const backToCart = document.getElementById('backToCart');
const orderSummaryItems = document.getElementById('orderSummaryItems');
const orderTotal = document.getElementById('orderTotal');
const applyDiscountBtn = document.getElementById('applyDiscountBtn');
const discountMessage = document.getElementById('discountMessage');
const discountCodeInput = document.getElementById('discountCode');

// تهيئة الموقع عند التحميل
document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    updateCartCount();
    setupEventListeners();
    refreshProductsFromServer();
});

async function refreshProductsFromServer() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        products = await response.json();
        saveToStorage('bariq_products', products);
        renderProducts();
    } catch (error) {
        console.error('Unable to fetch products from API:', error);
    }
}

// دالة لتحميل البيانات من LocalStorage
function loadFromStorage(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
        return defaultValue;
    }
}

// دالة لحفظ البيانات في LocalStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
        return false;
    }
}

// حفظ جميع البيانات
function saveAllData() {
    saveToStorage('bariq_products', products);
    saveToStorage('bariq_cart', cart);
}

// إعداد المستمعين للأحداث
function setupEventListeners() {
    // قائمة الهامبرجر
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر على رابط
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // تسجيل الدخول
    adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });

    adminLoginBtnMobile.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
        hamburgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: username, pass: password })
            });

            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();

            localStorage.setItem('bariq_admin_logged_in', 'true');
            if (data.token) {
                localStorage.setItem('bariq_admin_token', data.token);
            }

            window.location.href = 'admin.html';
            loginForm.reset();
        } catch (error) {
            alert('اسم المستخدم أو كلمة المرور غير صحيحة! حاول مرة أخرى.');
        }
    });

    // عربة التسوق
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('open');
        renderCartItems();
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('open');
    });

    checkoutModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('سلة التسوق فارغة!');
            return;
        }

        cartModal.classList.remove('open');
        showCheckoutPage();
    });

    // Quick View Modal
    closeQuickView.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
    });

    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.style.display = 'none';
        }
    });

    // صفحة إتمام الشراء
    backToCart.addEventListener('click', (e) => {
        e.preventDefault();
        hideCheckoutPage();
        cartModal.classList.add('open');
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        completeOrder();
    });

    // تطبيق الخصم
    applyDiscountBtn.addEventListener('click', applyDiscount);

    // تطبيق الخصم عند الضغط على Enter
    discountCodeInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyDiscount();
        }
    });

    // التنقل السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// عرض المنتجات في المتجر
function renderProducts() {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const badgesHTML = product.badge ?
            `<div class="product-badges">
                <span class="badge ${product.badge}">
                    ${product.badge === 'sale' ? 'خصم' : product.badge === 'new' ? 'جديد' : 'نفذ'}
                </span>
            </div>` : '';

        const priceHTML = product.discount ?
            `<div class="price-container">
                <span class="current-price">${formatEGP(product.price)}</span>
                <span class="original-price">${formatEGP(product.originalPrice)}</span>
                <span class="discount-percent">${product.discount}%</span>
            </div>` :
            `<div class="price-container">
                <span class="current-price">${formatEGP(product.price)}</span>
            </div>`;

        const actionsHTML = product.status === 'out-of-stock' ?
            `<div class="product-actions">
                <button class="buy-btn" disabled>نفذ من المخزون</button>
            </div>` :
            `<div class="product-actions">
                <button class="buy-btn" data-id="${product.id}">شراء</button>
                <button class="add-to-cart-btn" data-id="${product.id}">أضف إلى السلة</button>
            </div>`;

        productCard.innerHTML = `
            ${badgesHTML}
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    ${priceHTML}
                </div>
                ${actionsHTML}
            </div>
        `;

        productsContainer.appendChild(productCard);
    });

    document.querySelectorAll('.buy-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            openQuickView(productId);
        });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// عرض تفاصيل المنتج في نافذة Quick View
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('quickViewTitle').textContent = product.name;
    document.getElementById('quickViewProductName').textContent = product.name;
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewImage').alt = product.name;

    const priceHTML = product.discount ?
        `<span style="text-decoration: line-through; color: var(--gray-color); margin-left: 10px;">${formatEGP(product.originalPrice)}</span>
         <span class="discount-badge">${product.discount}% خصم</span>
         <br><span>${formatEGP(product.price)}</span>` :
        `${formatEGP(product.price)}`;

    document.getElementById('quickViewPrice').innerHTML = priceHTML;
    document.getElementById('quickViewDescription').textContent = product.description;

    const featuresList = product.features.map(feature => `<li>${feature}</li>`).join('');
    document.getElementById('quickViewFeatures').innerHTML = featuresList;

    const orderNowBtn = document.getElementById('orderNowBtn');
    const addToCartBtn = document.getElementById('addToCartFromQuickView');

    orderNowBtn.onclick = () => {
        addToCart(productId, 1, true);
        quickViewModal.style.display = 'none';
    };

    addToCartBtn.onclick = () => {
        addToCart(productId);
        quickViewModal.style.display = 'none';
    };

    quickViewModal.style.display = 'flex';
}

// إضافة منتج إلى السلة
function addToCart(productId, quantity = 1, orderNow = false) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.status === 'out-of-stock') {
        alert('هذا المنتج غير متوفر حالياً!');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    updateCartCount();
    renderCartItems();
    saveAllData();

    if (!orderNow) {
        alert(`تم إضافة ${product.name} إلى سلة التسوق!`);
    }

    if (orderNow) {
        cartModal.classList.add('open');
        renderCartItems();
    }
}

// تحديث عداد السلة
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// عرض عناصر السلة
function renderCartItems() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--gray-color);">سلة التسوق فارغة</p>';
        cartTotal.textContent = formatEGP(0);
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatEGP(item.price)}</div>
                <div class="cart-item-actions">
                    <div class="quantity-btn decrease-quantity" data-id="${item.id}">-</div>
                    <div class="quantity">${item.quantity}</div>
                    <div class="quantity-btn increase-quantity" data-id="${item.id}">+</div>
                    <div class="remove-item" data-id="${item.id}">إزالة</div>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = formatEGP(total);

    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// تحديث كمية منتج في السلة
function updateCartItemQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        updateCartCount();
        renderCartItems();
        saveAllData();
    }
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCartCount();
        renderCartItems();
        saveAllData();
    }
}

// عرض صفحة إتمام الشراء
function showCheckoutPage() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.featured-products').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    checkoutPage.style.display = 'block';
    updateOrderSummary();
}

// إخفاء صفحة إتمام الشراء
function hideCheckoutPage() {
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.featured-products').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    checkoutPage.style.display = 'none';
}

// دالة تطبيق الخصم
async function applyDiscount() {
    const discountCode = discountCodeInput.value.trim().toUpperCase();

    if (!discountCode) {
        discountMessage.textContent = 'يرجى إدخال كود الخصم';
        discountMessage.style.color = 'orange';
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/discounts/validate/${discountCode}`);
        if (!response.ok) throw new Error('Invalid discount');

        const discount = await response.json();
        appliedDiscount = discount;
        discountValue = discount.percent;
        discountMessage.textContent = `تم تطبيق خصم ${discount.percent}% بنجاح`;
        discountMessage.style.color = 'green';
    } catch (error) {
        discountMessage.textContent = 'كود الخصم غير صالح أو منتهي الصلاحية';
        discountMessage.style.color = 'red';
        appliedDiscount = null;
        discountValue = 0;
    }

    updateOrderSummary();
}

// تحديث ملخص الطلب
function updateOrderSummary() {
    orderSummaryItems.innerHTML = '';

    if (cart.length === 0) {
        orderTotal.textContent = formatEGP(0);
        document.getElementById('discountSummary').style.display = 'none';
        return;
    }

    let subtotal = 0;
    let discountAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name} × ${item.quantity}</div>
                <div class="order-item-price">${formatEGP(itemTotal)}</div>
            </div>
        `;
        orderSummaryItems.appendChild(orderItem);
    });

    // حساب الخصم إذا وجد
    if (appliedDiscount) {
        discountAmount = (subtotal * discountValue) / 100;
        const totalAfterDiscount = subtotal - discountAmount;

        document.getElementById('discountSummary').style.display = 'block';
        document.getElementById('discountAmount').textContent = `-${formatEGP(discountAmount)}`;
        document.getElementById('subtotalAfterDiscount').textContent = formatEGP(totalAfterDiscount);
        document.getElementById('orderTotal').textContent = formatEGP(totalAfterDiscount);
    } else {
        document.getElementById('discountSummary').style.display = 'none';
        document.getElementById('orderTotal').textContent = formatEGP(subtotal);
    }
}

// إتمام الطلب
async function completeOrder() {
    if (cart.length === 0) {
        alert('سلة التسوق فارغة!');
        return;
    }

    const customerName = document.getElementById('customerName').value;
    const phone1 = document.getElementById('phone1').value;
    const phone2 = document.getElementById('phone2').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    const discountCode = discountCodeInput.value.trim().toUpperCase();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedDiscount ? (subtotal * discountValue) / 100 : 0;
    const total = subtotal - discountAmount;

    const orderPayload = {
        customerName,
        phone1,
        phone2,
        email,
        address,
        city,
        additionalInfo,
        discountCode: discountCode || null,
        discountPercent: discountValue,
        discountAmount,
        subtotal,
        products: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        })),
        amount: total
    };

    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        if (!response.ok) throw new Error('Failed to submit order');
        const savedOrder = await response.json();

        let message = `شكراً لك، ${customerName}!\nرقم الطلب الخاص بك هو #${savedOrder.id}.`;
        if (appliedDiscount) {
            message += `\nتم تطبيق خصم ${discountValue}% بنجاح.`;
        }
        message += '\nسيتواصل معك فريقنا خلال 24 ساعة لتأكيد الطلب.';
        alert(message);
    } catch (error) {
        console.error('Order submission failed:', error);
        alert('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى أو تواصل معنا مباشرة.');
        return;
    }

    cart = [];
    appliedDiscount = null;
    discountValue = 0;
    updateCartCount();
    saveAllData();

    hideCheckoutPage();
    checkoutForm.reset();
    cartModal.classList.remove('open');
    document.getElementById('discountSummary').style.display = 'none';
    document.getElementById('discountMessage').textContent = '';
}

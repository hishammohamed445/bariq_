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

const defaultDiscounts = [
    { id: 1, code: "BARIQ25", percent: 25, startDate: "2025-12-01", endDate: "2025-12-31", status: "active" },
    { id: 2, code: "WELCOME10", percent: 10, startDate: "2025-11-01", endDate: "2025-12-31", status: "active" },
    { id: 3, code: "SAVE15", percent: 15, startDate: "2025-10-01", endDate: "2025-10-31", status: "expired" }
];

const API_BASE = '/api';

let products = [];
let orders = [];
let discounts = [];

let editingProductId = null;
let editingDiscountId = null;
let currentOrderId = null;

const getAdminToken = () => localStorage.getItem('bariq_admin_token');

function handleUnauthorized() {
    localStorage.removeItem('bariq_admin_logged_in');
    localStorage.removeItem('bariq_admin_token');
    window.location.href = 'index.html';
}

async function fetchWithAuth(endpoint, options = {}) {
    const token = getAdminToken();
    const headers = { ...(options.headers || {}) };
    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (response.status === 401) {
        handleUnauthorized();
    }
    return response;
}

async function loadDashboardData() {
    try {
        const [productsRes, ordersRes, discountsRes] = await Promise.all([
            fetch(`${API_BASE}/products`),
            fetchWithAuth('/orders'),
            fetchWithAuth('/discounts')
        ]);

        if (!productsRes.ok || !ordersRes.ok || !discountsRes.ok) {
            throw new Error('Failed to load dashboard data');
        }

        products = await productsRes.json();
        orders = await ordersRes.json();
        discounts = await discountsRes.json();
    } catch (error) {
        console.error('Unable to load dashboard data:', error);
        alert('تعذر تحميل البيانات من الخادم. حاول مرة أخرى لاحقاً.');
    }
}

async function refreshProductsData() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to refresh products');
    products = await response.json();
}

async function refreshOrdersData() {
    const response = await fetchWithAuth('/orders');
    if (!response.ok) throw new Error('Failed to refresh orders');
    orders = await response.json();
}

async function refreshDiscountsData() {
    const response = await fetchWithAuth('/discounts');
    if (!response.ok) throw new Error('Failed to refresh discounts');
    discounts = await response.json();
}

// دالة لتنسيق الأرقام كمبالغ بالجنيه المصري
function formatEGP(amount) {
    return `ج.م ${amount.toLocaleString('ar-EG')}`;
}

function formatOrderDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date) ? value : date.toLocaleDateString('ar-EG');
}

// عناصر DOM الرئيسية
const logoutBtn = document.getElementById('logoutBtn');
const addProductBtn = document.getElementById('addProductBtn');
const productFormModal = document.getElementById('productFormModal');
const closeProductForm = document.getElementById('closeProductForm');
const productForm = document.getElementById('productForm');
const addDiscountBtn = document.getElementById('addDiscountBtn');
const discountFormModal = document.getElementById('discountFormModal');
const closeDiscountForm = document.getElementById('closeDiscountForm');
const discountForm = document.getElementById('discountForm');
const orderDetailsModal = document.getElementById('orderDetailsModal');
const closeOrderDetails = document.getElementById('closeOrderDetails');
const markAllComplete = document.getElementById('markAllComplete');
const clearAllOrders = document.getElementById('clearAllOrders');
const resetProductsBtn = document.getElementById('resetProductsBtn');
const resetDiscountsBtn = document.getElementById('resetDiscountsBtn');

// تهيئة لوحة التحكم عند التحميل
document.addEventListener('DOMContentLoaded', async function () {
    checkAuth();
    setupEventListeners();
    setupAdminTabs();
    await loadDashboardData();
    loadAdminDashboard();
});

// دالة التحقق من المصادقة
function checkAuth() {
    const isLoggedIn = localStorage.getItem('bariq_admin_logged_in');
    if (!isLoggedIn || !getAdminToken()) {
        handleUnauthorized();
    }
}

// إعداد المستمعين للأحداث
function setupEventListeners() {
    // تسجيل الخروج
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('bariq_admin_logged_in');
        localStorage.removeItem('bariq_admin_token');
        window.location.href = 'index.html';
    });

    // Product Form
    closeProductForm.addEventListener('click', () => {
        productFormModal.style.display = 'none';
        productForm.reset();
        editingProductId = null;
    });

    productFormModal.addEventListener('click', (e) => {
        if (e.target === productFormModal) {
            productFormModal.style.display = 'none';
            productForm.reset();
            editingProductId = null;
        }
    });

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProduct();
    });

    // Discount Form
    closeDiscountForm.addEventListener('click', () => {
        discountFormModal.style.display = 'none';
        discountForm.reset();
        editingDiscountId = null;
    });

    discountFormModal.addEventListener('click', (e) => {
        if (e.target === discountFormModal) {
            discountFormModal.style.display = 'none';
            discountForm.reset();
            editingDiscountId = null;
        }
    });

    discountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveDiscount();
    });

    // Order Details Modal
    closeOrderDetails.addEventListener('click', () => {
        orderDetailsModal.style.display = 'none';
        currentOrderId = null;
    });

    orderDetailsModal.addEventListener('click', (e) => {
        if (e.target === orderDetailsModal) {
            orderDetailsModal.style.display = 'none';
            currentOrderId = null;
        }
    });

    // Mark all orders as complete
    markAllComplete.addEventListener('click', async () => {
        if (!confirm('هل تريد تعيين جميع الطلبات كمكتملة؟')) return;
        try {
            await Promise.all(orders.map(order =>
                fetchWithAuth(`/orders/${order.id}/status`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'completed' })
                })
            ));
            await refreshOrdersData();
            renderRecentOrders();
            renderOrdersTable();
            updateAdminStats();
        } catch (error) {
            console.error('Failed to complete all orders:', error);
            alert('تعذر تحديث حالة الطلبات. حاول مرة أخرى.');
        }
    });

    // Clear all orders
    clearAllOrders.addEventListener('click', async () => {
        if (!confirm('هل تريد حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
        try {
            const response = await fetchWithAuth('/orders', { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete orders');
            await refreshOrdersData();
            renderRecentOrders();
            renderOrdersTable();
            updateAdminStats();
            alert('تم حذف جميع الطلبات بنجاح!');
        } catch (error) {
            console.error('Failed to clear orders:', error);
            alert('تعذر حذف جميع الطلبات. حاول مرة أخرى.');
        }
    });

    // Reset products to default
    resetProductsBtn.addEventListener('click', async () => {
        if (!confirm('هل تريد استعادة المنتجات الافتراضية؟ سيتم فقدان جميع المنتجات الحالية.')) return;
        try {
            const response = await fetchWithAuth('/products/reset', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to reset products');
            await refreshProductsData();
            renderProductsTable();
            updateAdminStats();
            alert('تم استعادة المنتجات الافتراضية بنجاح!');
        } catch (error) {
            console.error('Failed to reset products:', error);
            alert('تعذر استعادة المنتجات. حاول مرة أخرى.');
        }
    });

    // Reset discounts to default
    resetDiscountsBtn.addEventListener('click', async () => {
        if (!confirm('هل تريد استعادة الخصومات الافتراضية؟ سيتم فقدان جميع الخصومات الحالية.')) return;
        try {
            const response = await fetchWithAuth('/discounts/reset', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to reset discounts');
            await refreshDiscountsData();
            renderDiscountsTable();
            alert('تم استعادة الخصومات الافتراضية بنجاح!');
        } catch (error) {
            console.error('Failed to reset discounts:', error);
            alert('تعذر استعادة الخصومات. حاول مرة أخرى.');
        }
    });
}

// إدارة تبويبات لوحة التحكم
function setupAdminTabs() {
    const tabLinks = document.querySelectorAll('.admin-nav a[data-tab]');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            tabLinks.forEach(tab => tab.classList.remove('active'));
            link.classList.add('active');

            const tabs = document.querySelectorAll('.dashboard-tab');
            tabs.forEach(tab => tab.style.display = 'none');

            const tabId = link.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).style.display = 'block';

            if (tabId === 'productsTab') {
                renderProductsTable();
            } else if (tabId === 'ordersTab') {
                renderOrdersTable();
            } else if (tabId === 'discountsTab') {
                renderDiscountsTable();
            }
        });
    });
}

// تحميل لوحة التحكم
function loadAdminDashboard() {
    updateAdminStats();
    renderRecentOrders();
    renderProductsTable();

    addProductBtn.addEventListener('click', () => {
        document.getElementById('productFormTitle').textContent = 'إضافة منتج جديد';
        productForm.reset();
        editingProductId = null;
        productFormModal.style.display = 'flex';
    });

    addDiscountBtn.addEventListener('click', () => {
        document.getElementById('discountFormTitle').textContent = 'إضافة خصم جديد';
        discountForm.reset();

        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthFormatted = nextMonth.toISOString().split('T')[0];

        document.getElementById('discountStartDate').value = today;
        document.getElementById('discountEndDate').value = nextMonthFormatted;

        editingDiscountId = null;
        discountFormModal.style.display = 'flex';
    });
}

// تحديث إحصائيات لوحة التحكم
function updateAdminStats() {
    document.getElementById('ordersCount').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('customersCount').textContent = orders.length;
    document.getElementById('totalSales').textContent = formatEGP(orders.reduce((sum, order) => sum + order.amount, 0));
    document.getElementById('productsCount').textContent = products.filter(p => p.status !== 'out-of-stock').length;
}

// عرض الطلبات الحديثة في لوحة التحكم
function renderRecentOrders() {
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersBody = document.getElementById('recentOrders');

    recentOrdersBody.innerHTML = '';

    if (recentOrders.length === 0) {
        recentOrdersBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--gray-color);">لا توجد طلبات حديثة</td>
            </tr>
        `;
        return;
    }

    recentOrders.forEach(order => {
        const statusText = order.status === 'pending' ? 'قيد المراجعة' :
            order.status === 'completed' ? 'مكتمل' : 'ملغى';
        const statusClass = order.status === 'pending' ? 'pending' :
            order.status === 'completed' ? 'completed' : 'cancelled';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.phone1}</td>
            <td>${order.city}</td>
            <td>${formatEGP(order.amount)}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="section-actions">
                    <button class="action-btn view" data-id="${order.id}">عرض</button>
                    <button class="action-btn complete" data-id="${order.id}">إكمال</button>
                    <button class="action-btn delete" data-id="${order.id}">حذف</button>
                </div>
            </td>
        `;
        recentOrdersBody.appendChild(row);
    });

    document.querySelectorAll('#recentOrders .action-btn.view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            viewOrderDetails(orderId);
        });
    });

    document.querySelectorAll('#recentOrders .action-btn.complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            markOrderAsComplete(orderId);
        });
    });

    document.querySelectorAll('#recentOrders .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            deleteOrder(orderId);
        });
    });
}

// عرض جدول المنتجات في لوحة التحكم
function renderProductsTable() {
    const productsTableBody = document.getElementById('productsTableBody');

    productsTableBody.innerHTML = '';

    products.forEach(product => {
        const statusText = product.status === 'in-stock' ? 'متوفر' :
            product.status === 'out-of-stock' ? 'نفذ' : 'في عرض';
        const statusClass = product.status === 'in-stock' ? 'in-stock' :
            product.status === 'out-of-stock' ? 'out-of-stock' : 'on-sale';

        const discountHTML = product.discount ?
            `<span class="discount-badge">${product.discount}%</span>` : '-';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="product-image-cell">
                <img src="${product.image}" alt="${product.name}">
            </td>
            <td>${product.name}</td>
            <td>${formatEGP(product.price)}</td>
            <td>${discountHTML}</td>
            <td>${product.stock}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="section-actions">
                    <button class="action-btn edit" data-id="${product.id}">تعديل</button>
                    <button class="action-btn delete" data-id="${product.id}">حذف</button>
                </div>
            </td>
        `;
        productsTableBody.appendChild(row);
    });

    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// تعديل منتج
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productFormTitle').textContent = 'تعديل المنتج';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDiscount').value = product.discount || 0;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productFeatures').value = product.features ? product.features.join(', ') : '';

    editingProductId = productId;
    productFormModal.style.display = 'flex';
}

// حفظ المنتج (إضافة/تعديل)
async function saveProduct() {
    const id = editingProductId || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1);
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const discount = parseInt(document.getElementById('productDiscount').value) || 0;
    const stock = parseInt(document.getElementById('productStock').value);
    const status = document.getElementById('productStatus').value;
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;
    const features = document.getElementById('productFeatures').value.split(',').map(f => f.trim()).filter(f => f);

    const productData = {
        id,
        name,
        description,
        price,
        discount: discount > 0 ? discount : null,
        originalPrice: discount > 0 ? Math.round(price / (1 - discount / 100)) : null,
        image,
        category,
        stock,
        status,
        features,
        badge: discount > 0 ? 'sale' : stock === 0 ? 'sold-out' : 'new'
    };

    const isEdit = Boolean(editingProductId);

    try {
        const response = await fetchWithAuth(isEdit ? `/products/${editingProductId}` : '/products', {
            method: isEdit ? 'PUT' : 'POST',
            body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to save product');

        await refreshProductsData();
        productFormModal.style.display = 'none';
        productForm.reset();
        editingProductId = null;
        renderProductsTable();
        updateAdminStats();
        alert(isEdit ? 'تم تحديث المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!');
    } catch (error) {
        console.error('Failed to save product:', error);
        alert('تعذر حفظ المنتج. حاول مرة أخرى.');
    }
}

// حذف منتج
async function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
        const response = await fetchWithAuth(`/products/${productId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete product');
        await refreshProductsData();
        renderProductsTable();
        updateAdminStats();
    } catch (error) {
        console.error('Failed to delete product:', error);
        alert('تعذر حذف المنتج. حاول مرة أخرى.');
    }
}

// عرض جدول الطلبات في لوحة التحكم
function renderOrdersTable() {
    const ordersTableBody = document.getElementById('ordersTableBody');

    ordersTableBody.innerHTML = '';

    if (orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: var(--gray-color);">لا توجد طلبات</td>
            </tr>
        `;
        return;
    }

    orders.slice().reverse().forEach(order => {
        const statusText = order.status === 'pending' ? 'قيد المراجعة' :
            order.status === 'completed' ? 'مكتمل' : 'ملغى';
        const statusClass = order.status === 'pending' ? 'pending' :
            order.status === 'completed' ? 'completed' : 'cancelled';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.phone1}</td>
            <td>${order.address.substring(0, 30)}${order.address.length > 30 ? '...' : ''}</td>
            <td>${formatOrderDate(order.date)}</td>
            <td>${formatEGP(order.amount)}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="section-actions">
                    <button class="action-btn view" data-id="${order.id}">عرض</button>
                    <button class="action-btn complete" data-id="${order.id}">إكمال</button>
                    <button class="action-btn delete" data-id="${order.id}">حذف</button>
                </div>
            </td>
        `;
        ordersTableBody.appendChild(row);
    });

    document.querySelectorAll('#ordersTableBody .action-btn.view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            viewOrderDetails(orderId);
        });
    });

    document.querySelectorAll('#ordersTableBody .action-btn.complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            markOrderAsComplete(orderId);
        });
    });

    document.querySelectorAll('#ordersTableBody .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            deleteOrder(orderId);
        });
    });
}

// عرض تفاصيل الطلب
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentOrderId = orderId;

    document.getElementById('orderDetailsTitle').textContent = `تفاصيل الطلب #${order.id}`;
    document.getElementById('orderCustomerName').textContent = order.customerName;
    document.getElementById('orderPhone1').textContent = order.phone1;
    document.getElementById('orderPhone2').textContent = order.phone2 || 'لا يوجد';
    document.getElementById('orderEmail').textContent = order.email;
    document.getElementById('orderAddress').textContent = order.address;
    document.getElementById('orderCity').textContent = order.city;
    document.getElementById('orderAdditionalInfo').textContent = order.additionalInfo || 'لا توجد ملاحظات';
    document.getElementById('orderDate').textContent = formatOrderDate(order.date);
    document.getElementById('orderTotalAmount').textContent = formatEGP(order.amount);

    // عرض معلومات الخصم إذا وجدت
    const discountInfo = document.getElementById('orderDiscountInfo');
    const discountCodeElement = document.getElementById('orderDiscountCode');
    const discountDetails = document.getElementById('discountDetails');

    if (order.discountCode) {
        discountInfo.style.display = 'block';
        discountCodeElement.textContent = `${order.discountCode} (${order.discountPercent}%)`;

        // عرض تفاصيل الخصم
        discountDetails.style.display = 'block';
        discountDetails.innerHTML = `
            <h4 style="margin-bottom: 10px; color: var(--accent-color);">تفاصيل الخصم:</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>المبلغ قبل الخصم:</span>
                <span style="font-weight: bold;">${formatEGP(order.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: var(--accent-color);">
                <span>قيمة الخصم (${order.discountPercent}%):</span>
                <span style="font-weight: bold;">-${formatEGP(order.discountAmount)}</span>
            </div>
        `;
    } else {
        discountInfo.style.display = 'none';
        discountDetails.style.display = 'none';
    }

    const statusText = order.status === 'pending' ? 'قيد المراجعة' :
        order.status === 'completed' ? 'مكتمل' : 'ملغى';
    const statusClass = order.status === 'pending' ? 'pending' :
        order.status === 'completed' ? 'completed' : 'cancelled';

    document.getElementById('orderStatus').className = `status ${statusClass}`;
    document.getElementById('orderStatus').textContent = statusText;

    const orderProductsList = document.getElementById('orderProductsList');
    orderProductsList.innerHTML = '';

    order.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'order-product-item';
        productItem.innerHTML = `
            <div class="order-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="order-product-details">
                <div class="order-product-name">${product.name} × ${product.quantity}</div>
                <div class="order-product-price">${formatEGP(product.price)} × ${product.quantity} = ${formatEGP(product.price * product.quantity)}</div>
            </div>
        `;
        orderProductsList.appendChild(productItem);
    });

    document.getElementById('markOrderComplete').onclick = () => {
        markOrderAsComplete(orderId);
        orderDetailsModal.style.display = 'none';
    };

    document.getElementById('deleteOrderBtn').onclick = () => {
        deleteOrder(orderId);
        orderDetailsModal.style.display = 'none';
    };

    document.getElementById('printOrderBtn').onclick = () => {
        printOrder(orderId);
    };

    orderDetailsModal.style.display = 'flex';
}

// تعيين الطلب كمكتمل
async function markOrderAsComplete(orderId) {
    try {
        const response = await fetchWithAuth(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'completed' })
        });

        if (!response.ok) throw new Error('Failed to update order');

        await refreshOrdersData();
        renderRecentOrders();
        renderOrdersTable();
        updateAdminStats();
        alert(`تم تعيين الطلب #${orderId} كمكتمل بنجاح!`);
    } catch (error) {
        console.error('Failed to update order status:', error);
        alert('تعذر تحديث حالة الطلب. حاول مرة أخرى.');
    }
}

// حذف الطلب
async function deleteOrder(orderId) {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
        const response = await fetchWithAuth(`/orders/${orderId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete order');
        await refreshOrdersData();
        renderRecentOrders();
        renderOrdersTable();
        updateAdminStats();
    } catch (error) {
        console.error('Failed to delete order:', error);
        alert('تعذر حذف الطلب. حاول مرة أخرى.');
    }
}

// طباعة الطلب
function printOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const printWindow = window.open('', '_blank');
    const printableDate = formatOrderDate(order.date);

    // حساب الإجماليات
    const subtotal = order.subtotal || order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const discountAmount = order.discountAmount || 0;
    const total = order.amount;
    
    // تحضير محتوى الطباعة بشكل إيصال منظم
    const printContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إيصال باريك #${order.id}</title>
            <style>
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    body {
                        width: 80mm;
                        margin: 0;
                        padding: 10px;
                        font-family: 'Arial', sans-serif;
                        font-size: 12px;
                    }
                }
                
                body {
                    width: 80mm;
                    margin: 0 auto;
                    padding: 15px;
                    font-family: 'Arial', sans-serif;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #000;
                    background: white;
                }
                
                * {
                    box-sizing: border-box;
                }
                
                .receipt-container {
                    width: 100%;
                    max-width: 80mm;
                    margin: 0 auto;
                }
                
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #333;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                
                .store-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #d4af37;
                    margin: 0 0 5px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .receipt-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin: 5px 0;
                }
                
                .order-number {
                    font-size: 12px;
                    margin: 5px 0;
                }
                
                .info-section {
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px dashed #ccc;
                }
                
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 3px 0;
                }
                
                .info-label {
                    font-weight: bold;
                    color: #555;
                }
                
                .info-value {
                    text-align: left;
                    max-width: 60%;
                }
                
                .products-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                }
                
                .products-table th {
                    background-color: #f5f5f5;
                    border-bottom: 2px solid #333;
                    padding: 5px;
                    text-align: right;
                    font-size: 11px;
                }
                
                .products-table td {
                    padding: 5px;
                    border-bottom: 1px dashed #eee;
                    text-align: right;
                    font-size: 11px;
                }
                
                .product-name {
                    text-align: right;
                    max-width: 40%;
                }
                
                .product-qty {
                    text-align: center;
                    width: 15%;
                }
                
                .product-price {
                    text-align: left;
                    width: 20%;
                }
                
                .product-total {
                    text-align: left;
                    width: 25%;
                    font-weight: bold;
                }
                
                .amounts-section {
                    margin: 15px 0;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                }
                
                .amount-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                    padding: 3px 0;
                }
                
                .subtotal {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }
                
                .discount-row {
                    color: #d9534f;
                    font-weight: bold;
                }
                
                .total-row {
                    font-size: 14px;
                    font-weight: bold;
                    color: #d4af37;
                    border-top: 2px solid #333;
                    padding-top: 8px;
                    margin-top: 8px;
                }
                
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px dashed #333;
                    font-size: 10px;
                    color: #666;
                }
                
                .thank-you {
                    font-size: 11px;
                    font-weight: bold;
                    margin: 10px 0;
                    color: #333;
                }
                
                .contact-info {
                    font-size: 10px;
                    margin: 5px 0;
                }
                
                .barcode-area {
                    text-align: center;
                    margin: 15px 0;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 3px;
                }
                
                .barcode {
                    font-family: monospace;
                    letter-spacing: 3px;
                    font-size: 14px;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: bold;
                    margin-right: 5px;
                }
                
                .status-pending {
                    background-color: #f0ad4e;
                    color: white;
                }
                
                .status-completed {
                    background-color: #5cb85c;
                    color: white;
                }
                
                .separator {
                    border-top: 1px dashed #999;
                    margin: 10px 0;
                }
                
                .notes {
                    margin: 10px 0;
                    padding: 8px;
                    background-color: #fffde7;
                    border-right: 3px solid #ffd54f;
                    font-size: 11px;
                    color: #5d4037;
                }
                
                .print-date {
                    text-align: center;
                    font-size: 10px;
                    color: #777;
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <!-- Header -->
                <div class="header">
                    <div class="store-name">BARIQ</div>
                    <div class="receipt-title">إيصال استلام طلب</div>
                    <div class="order-number">رقم الطلب: #${order.id}</div>
                    <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')} ${new Date().toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                
                <!-- Customer Info -->
                <div class="info-section">
                    <div class="info-row">
                        <span class="info-label">اسم العميل:</span>
                        <span class="info-value">${order.customerName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">رقم الهاتف:</span>
                        <span class="info-value">${order.phone1}</span>
                    </div>
                    ${order.phone2 ? `<div class="info-row">
                        <span class="info-label">رقم بديل:</span>
                        <span class="info-value">${order.phone2}</span>
                    </div>` : ''}
                    <div class="info-row">
                        <span class="info-label">المدينة:</span>
                        <span class="info-value">${order.city}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">تاريخ الطلب:</span>
                        <span class="info-value">${printableDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">حالة الطلب:</span>
                        <span class="info-value">
                            <span class="status-badge ${order.status === 'pending' ? 'status-pending' : 'status-completed'}">
                                ${order.status === 'pending' ? 'قيد المراجعة' : 'مكتمل'}
                            </span>
                        </span>
                    </div>
                </div>
                
                <div class="separator"></div>
                
                <!-- Products -->
                <div style="margin: 10px 0;">
                    <div style="text-align: center; font-weight: bold; margin-bottom: 8px;">المنتجات المطلوبة</div>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th class="product-name">المنتج</th>
                                <th class="product-qty">الكمية</th>
                                <th class="product-price">السعر</th>
                                <th class="product-total">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.products.map(p => `
                                <tr>
                                    <td class="product-name">${p.name}</td>
                                    <td class="product-qty">${p.quantity}</td>
                                    <td class="product-price">${formatEGP(p.price)}</td>
                                    <td class="product-total">${formatEGP(p.price * p.quantity)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Amounts -->
                <div class="amounts-section">
                    <div class="amount-row subtotal">
                        <span>المبلغ الإجمالي:</span>
                        <span>${formatEGP(subtotal)}</span>
                    </div>
                    
                    ${order.discountCode ? `
                        <div class="amount-row discount-row">
                            <span>الخصم (${order.discountCode} - ${order.discountPercent}%):</span>
                            <span>-${formatEGP(discountAmount)}</span>
                        </div>
                    ` : ''}
                    
                    <div class="amount-row total-row">
                        <span>المبلغ النهائي:</span>
                        <span>${formatEGP(total)}</span>
                    </div>
                </div>
                
                ${order.additionalInfo ? `
                    <div class="notes">
                        <div style="font-weight: bold; margin-bottom: 3px;">ملاحظات:</div>
                        ${order.additionalInfo}
                    </div>
                ` : ''}
                
                <!-- Barcode Area -->
                <div class="barcode-area">
                    <div style="margin-bottom: 5px; font-size: 10px;">رمز الطلب</div>
                    <div class="barcode">* ${order.id.toString().padStart(6, '0')} *</div>
                    <div style="font-size: 9px; margin-top: 3px;">BARIQ-${order.id.toString().padStart(6, '0')}</div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="thank-you">شكراً لاختيارك بريق</div>
                    <div class="contact-info">للاستفسار: 01023836244</div>
                    <div class="contact-info">www.bariq-watches.com</div>
                    <div style="margin-top: 10px; font-size: 9px; color: #999;">
                        هذا الإيصال صالح كفاتورة غير ضريبية
                    </div>
                    <div style="font-size: 9px; color: #999; margin-top: 5px;">
                        ${new Date().getFullYear()} © جميع الحقوق محفوظة
                    </div>
                </div>
            </div>
            
            <script>
                // طباعة تلقائية عند تحميل الصفحة
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        // إغلاق النافذة بعد الطباعة (اختياري)
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
}
// عرض جدول الخصومات في لوحة التحكم
function renderDiscountsTable() {
    const discountsTableBody = document.getElementById('discountsTableBody');

    discountsTableBody.innerHTML = '';

    discounts.forEach(discount => {
        const statusText = discount.status === 'active' ? 'نشط' :
            discount.status === 'inactive' ? 'غير نشط' : 'منتهي';
        const statusClass = discount.status === 'active' ? 'in-stock' :
            discount.status === 'inactive' ? 'out-of-stock' : 'pending';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${discount.code}</td>
            <td>${discount.percent}%</td>
            <td>${discount.startDate}</td>
            <td>${discount.endDate}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="section-actions">
                    <button class="action-btn edit" data-id="${discount.id}">تعديل</button>
                    <button class="action-btn delete" data-id="${discount.id}">حذف</button>
                </div>
            </td>
        `;
        discountsTableBody.appendChild(row);
    });

    document.querySelectorAll('#discountsTableBody .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const discountId = parseInt(e.target.getAttribute('data-id'));
            editDiscount(discountId);
        });
    });

    document.querySelectorAll('#discountsTableBody .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const discountId = parseInt(e.target.getAttribute('data-id'));
            deleteDiscount(discountId);
        });
    });
}

// تعديل خصم
function editDiscount(discountId) {
    const discount = discounts.find(d => d.id === discountId);
    if (!discount) return;

    document.getElementById('discountFormTitle').textContent = 'تعديل الخصم';
    document.getElementById('discountId').value = discount.id;
    document.getElementById('discountCode').value = discount.code;
    document.getElementById('discountPercent').value = discount.percent;
    document.getElementById('discountStartDate').value = discount.startDate;
    document.getElementById('discountEndDate').value = discount.endDate;
    document.getElementById('discountStatus').value = discount.status;

    editingDiscountId = discountId;
    discountFormModal.style.display = 'flex';
}

// حفظ الخصم (إضافة/تعديل)
async function saveDiscount() {
    const id = editingDiscountId || (discounts.length > 0 ? Math.max(...discounts.map(d => d.id)) + 1 : 1);
    const code = document.getElementById('discountCode').value.toUpperCase();
    const percent = parseInt(document.getElementById('discountPercent').value);
    const startDate = document.getElementById('discountStartDate').value;
    const endDate = document.getElementById('discountEndDate').value;
    const status = document.getElementById('discountStatus').value;

    const discountData = {
        id,
        code,
        percent,
        startDate,
        endDate,
        status
    };

    const isEdit = Boolean(editingDiscountId);

    try {
        const response = await fetchWithAuth(isEdit ? `/discounts/${editingDiscountId}` : '/discounts', {
            method: isEdit ? 'PUT' : 'POST',
            body: JSON.stringify(discountData)
        });

        if (!response.ok) throw new Error('Failed to save discount');

        await refreshDiscountsData();
        discountFormModal.style.display = 'none';
        discountForm.reset();
        editingDiscountId = null;
        renderDiscountsTable();
        alert(isEdit ? 'تم تحديث الخصم بنجاح!' : 'تم إضافة الخصم بنجاح!');
    } catch (error) {
        console.error('Failed to save discount:', error);
        alert('تعذر حفظ الخصم. حاول مرة أخرى.');
    }
}

// حذف خصم
async function deleteDiscount(discountId) {
    if (!confirm('هل أنت متأكد من حذف هذا الخصم؟')) return;
    try {
        const response = await fetchWithAuth(`/discounts/${discountId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete discount');
        await refreshDiscountsData();
        renderDiscountsTable();
    } catch (error) {
        console.error('Failed to delete discount:', error);
        alert('تعذر حذف الخصم. حاول مرة أخرى.');
    }
}
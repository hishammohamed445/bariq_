require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const {
    defaultProducts,
    defaultDiscounts
} = require("./data/defaults");
const {
    PRODUCTS_FILE,
    DISCOUNTS_FILE,
    ORDERS_FILE,
    safeReadJSON,
    safeWriteJSON,
    ensureFileExists
} = require("./utils/storage");

const app = express();

const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || "ebrahem57";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "01023836244";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "bariq-admin-token";

ensureFileExists(PRODUCTS_FILE, defaultProducts);
ensureFileExists(DISCOUNTS_FILE, defaultDiscounts);
ensureFileExists(ORDERS_FILE, []);

app.use(cors());
app.use(express.json());

const loadProducts = () => safeReadJSON(PRODUCTS_FILE, defaultProducts);
const saveProducts = (data) => safeWriteJSON(PRODUCTS_FILE, data);
const loadDiscounts = () => safeReadJSON(DISCOUNTS_FILE, defaultDiscounts);
const saveDiscounts = (data) => safeWriteJSON(DISCOUNTS_FILE, data);
const loadOrders = () => safeReadJSON(ORDERS_FILE, []);
const saveOrders = (data) => safeWriteJSON(ORDERS_FILE, data);

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"] || "";
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
        return next();
    }
    return res.status(401).json({ status: "error", message: "Unauthorized" });
};

const nextId = (items) => {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
};

// Auth
app.post("/api/login", (req, res) => {
    const { user, pass } = req.body || {};
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
        return res.json({ status: "ok", token: ADMIN_TOKEN });
    }
    return res.status(401).json({ status: "error", message: "Invalid credentials" });
});

// Products
app.get("/api/products", (_req, res) => {
    res.json(loadProducts());
});

app.post("/api/products", verifyAdmin, (req, res) => {
    const products = loadProducts();
    const newProduct = {
        ...req.body,
        id: nextId(products)
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

app.put("/api/products/:id", verifyAdmin, (req, res) => {
    const products = loadProducts();
    const productId = Number(req.params.id);
    const index = products.findIndex((product) => Number(product.id) === productId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Product not found" });
    }

    products[index] = { ...products[index], ...req.body, id: productId };
    saveProducts(products);
    res.json(products[index]);
});

app.delete("/api/products/:id", verifyAdmin, (req, res) => {
    let products = loadProducts();
    const productId = Number(req.params.id);
    const existing = products.some((product) => Number(product.id) === productId);

    if (!existing) {
        return res.status(404).json({ status: "error", message: "Product not found" });
    }

    products = products.filter((product) => Number(product.id) !== productId);
    saveProducts(products);
    res.json({ status: "ok" });
});

app.post("/api/products/reset", verifyAdmin, (_req, res) => {
    saveProducts(defaultProducts);
    res.json({ status: "ok", products: defaultProducts });
});

// Discounts
app.get("/api/discounts", verifyAdmin, (_req, res) => {
    res.json(loadDiscounts());
});

app.post("/api/discounts", verifyAdmin, (req, res) => {
    const discounts = loadDiscounts();
    const newDiscount = {
        ...req.body,
        id: nextId(discounts)
    };
    discounts.push(newDiscount);
    saveDiscounts(discounts);
    res.status(201).json(newDiscount);
});

app.put("/api/discounts/:id", verifyAdmin, (req, res) => {
    const discounts = loadDiscounts();
    const discountId = Number(req.params.id);
    const index = discounts.findIndex((discount) => Number(discount.id) === discountId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Discount not found" });
    }

    discounts[index] = { ...discounts[index], ...req.body, id: discountId };
    saveDiscounts(discounts);
    res.json(discounts[index]);
});

app.delete("/api/discounts/:id", verifyAdmin, (req, res) => {
    let discounts = loadDiscounts();
    const discountId = Number(req.params.id);
    const exists = discounts.some((discount) => Number(discount.id) === discountId);

    if (!exists) {
        return res.status(404).json({ status: "error", message: "Discount not found" });
    }

    discounts = discounts.filter((discount) => Number(discount.id) !== discountId);
    saveDiscounts(discounts);
    res.json({ status: "ok" });
});

app.post("/api/discounts/reset", verifyAdmin, (_req, res) => {
    saveDiscounts(defaultDiscounts);
    res.json({ status: "ok", discounts: defaultDiscounts });
});

app.get("/api/discounts/validate/:code", (req, res) => {
    const { code } = req.params;
    const now = new Date();
    const discounts = loadDiscounts();
    const discount = discounts.find((discountItem) =>
        discountItem.code === code &&
        discountItem.status === "active" &&
        new Date(discountItem.startDate) <= now &&
        new Date(discountItem.endDate) >= now
    );

    if (!discount) {
        return res.status(404).json({ status: "error", message: "Discount not found or inactive" });
    }

    return res.json(discount);
});

// Orders
app.get("/api/orders", verifyAdmin, (_req, res) => {
    res.json(loadOrders());
});

app.post("/api/orders", (req, res) => {
    const orders = loadOrders();
    const orderPayload = req.body || {};

    if (!Array.isArray(orderPayload.products) || orderPayload.products.length === 0) {
        return res.status(400).json({ status: "error", message: "Order must include products" });
    }

    const newOrder = {
        id: nextId(orders),
        status: "pending",
        date: new Date().toISOString(),
        ...orderPayload
    };

    orders.push(newOrder);
    saveOrders(orders);
    res.status(201).json(newOrder);
});

app.patch("/api/orders/:id/status", verifyAdmin, (req, res) => {
    const orders = loadOrders();
    const orderId = Number(req.params.id);
    const index = orders.findIndex((order) => Number(order.id) === orderId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Order not found" });
    }

    orders[index].status = req.body.status || orders[index].status;
    saveOrders(orders);
    res.json(orders[index]);
});

app.delete("/api/orders/:id", verifyAdmin, (req, res) => {
    let orders = loadOrders();
    const orderId = Number(req.params.id);
    const exists = orders.some((order) => Number(order.id) === orderId);

    if (!exists) {
        return res.status(404).json({ status: "error", message: "Order not found" });
    }

    orders = orders.filter((order) => Number(order.id) !== orderId);
    saveOrders(orders);
    res.json({ status: "ok" });
});

app.delete("/api/orders", verifyAdmin, (_req, res) => {
    saveOrders([]);
    res.json({ status: "ok" });
});

// Static frontend
app.use(express.static(path.join(__dirname, "frontend")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

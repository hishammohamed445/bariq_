const express = require("express");
const {
    loadProducts,
    saveProducts,
    loadDiscounts,
    saveDiscounts,
    loadOrders,
    saveOrders,
    clearOrders
} = require("../utils/dataStore");
const { defaultProducts, defaultDiscounts } = require("../data/defaults");
const { ADMIN_USER, ADMIN_PASSWORD, ADMIN_TOKEN } = require("./config");

const router = express.Router();
router.use(express.json());

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"] || "";
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
        return next();
    }
    return res.status(401).json({ status: "error", message: "Unauthorized" });
};

const cloneDefaults = (data) => JSON.parse(JSON.stringify(data));

router.post("/login", asyncHandler(async (req, res) => {
    const { user, pass } = req.body || {};
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
        return res.json({ status: "ok", token: ADMIN_TOKEN });
    }
    return res.status(401).json({ status: "error", message: "Invalid credentials" });
}));

router.get("/products", asyncHandler(async (_req, res) => {
    const products = await loadProducts();
    res.json(products);
}));

router.post("/products", verifyAdmin, asyncHandler(async (req, res) => {
    const products = await loadProducts();
    const newProduct = {
        ...req.body,
        id: products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1
    };
    products.push(newProduct);
    await saveProducts(products);
    res.status(201).json(newProduct);
}));

router.put("/products/:id", verifyAdmin, asyncHandler(async (req, res) => {
    const products = await loadProducts();
    const productId = Number(req.params.id);
    const index = products.findIndex((product) => Number(product.id) === productId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Product not found" });
    }

    products[index] = { ...products[index], ...req.body, id: productId };
    await saveProducts(products);
    res.json(products[index]);
}));

router.delete("/products/:id", verifyAdmin, asyncHandler(async (req, res) => {
    const products = await loadProducts();
    const productId = Number(req.params.id);
    const exists = products.some((product) => Number(product.id) === productId);

    if (!exists) {
        return res.status(404).json({ status: "error", message: "Product not found" });
    }

    const updated = products.filter((product) => Number(product.id) !== productId);
    await saveProducts(updated);
    res.json({ status: "ok" });
}));

router.post("/products/reset", verifyAdmin, asyncHandler(async (_req, res) => {
    const defaults = cloneDefaults(defaultProducts);
    await saveProducts(defaults);
    res.json({ status: "ok", products: defaults });
}));

router.get("/discounts", verifyAdmin, asyncHandler(async (_req, res) => {
    const discounts = await loadDiscounts();
    res.json(discounts);
}));

router.post("/discounts", verifyAdmin, asyncHandler(async (req, res) => {
    const discounts = await loadDiscounts();
    const newDiscount = {
        ...req.body,
        id: discounts.length > 0 ? Math.max(...discounts.map((d) => Number(d.id) || 0)) + 1 : 1
    };
    discounts.push(newDiscount);
    await saveDiscounts(discounts);
    res.status(201).json(newDiscount);
}));

router.put("/discounts/:id", verifyAdmin, asyncHandler(async (req, res) => {
    const discounts = await loadDiscounts();
    const discountId = Number(req.params.id);
    const index = discounts.findIndex((discount) => Number(discount.id) === discountId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Discount not found" });
    }

    discounts[index] = { ...discounts[index], ...req.body, id: discountId };
    await saveDiscounts(discounts);
    res.json(discounts[index]);
}));

router.delete("/discounts/:id", verifyAdmin, asyncHandler(async (req, res) => {
    const discounts = await loadDiscounts();
    const discountId = Number(req.params.id);
    const exists = discounts.some((discount) => Number(discount.id) === discountId);

    if (!exists) {
        return res.status(404).json({ status: "error", message: "Discount not found" });
    }

    const updated = discounts.filter((discount) => Number(discount.id) !== discountId);
    await saveDiscounts(updated);
    res.json({ status: "ok" });
}));

router.post("/discounts/reset", verifyAdmin, asyncHandler(async (_req, res) => {
    const defaults = cloneDefaults(defaultDiscounts);
    await saveDiscounts(defaults);
    res.json({ status: "ok", discounts: defaults });
}));

router.get("/discounts/validate/:code", asyncHandler(async (req, res) => {
    const { code } = req.params;
    const now = new Date();
    const discounts = await loadDiscounts();
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
}));

router.get("/orders", verifyAdmin, asyncHandler(async (_req, res) => {
    const orders = await loadOrders();
    res.json(orders);
}));

router.post("/orders", asyncHandler(async (req, res) => {
    const orders = await loadOrders();
    const orderPayload = req.body || {};

    if (!Array.isArray(orderPayload.products) || orderPayload.products.length === 0) {
        return res.status(400).json({ status: "error", message: "Order must include products" });
    }

    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map((o) => Number(o.id) || 0)) + 1 : 1,
        status: "pending",
        date: new Date().toISOString(),
        ...orderPayload
    };

    orders.push(newOrder);
    await saveOrders(orders);
    res.status(201).json(newOrder);
}));

router.patch("/orders/:id/status", verifyAdmin, asyncHandler(async (req, res) => {
    const orders = await loadOrders();
    const orderId = Number(req.params.id);
    const index = orders.findIndex((order) => Number(order.id) === orderId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Order not found" });
    }

    orders[index].status = req.body.status || orders[index].status;
    await saveOrders(orders);
    res.json(orders[index]);
}));

router.delete("/orders/:id", verifyAdmin, asyncHandler(async (req, res) => {
    const orders = await loadOrders();
    const orderId = Number(req.params.id);
    const exists = orders.some((order) => Number(order.id) === orderId);

    if (!exists) {
        return res.status(404).json({ status: "error", message: "Order not found" });
    }

    const updated = orders.filter((order) => Number(order.id) !== orderId);
    await saveOrders(updated);
    res.json({ status: "ok" });
}));

router.delete("/orders", verifyAdmin, asyncHandler(async (_req, res) => {
    await clearOrders();
    res.json({ status: "ok" });
}));

router.use((error, _req, res, _next) => {
    console.error("API error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
});

module.exports = router;

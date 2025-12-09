const { defaultProducts, defaultDiscounts } = require("../data/defaults");
const {
    PRODUCTS_FILE,
    DISCOUNTS_FILE,
    ORDERS_FILE,
    safeReadJSON,
    safeWriteJSON,
    ensureFileExists
} = require("./storage");

const POSTGRES_ENV_KEYS = [
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_PRISMA_URL_NON_POOLING",
    "POSTGRES_URL_NO_SSL",
    "DATABASE_URL"
];

const hasPostgresConfig = POSTGRES_ENV_KEYS.some((key) => Boolean(process.env[key]));

let sql;
let usePostgres = false;
try {
    ({ sql } = require("@vercel/postgres"));
    usePostgres = hasPostgresConfig;
} catch (error) {
    usePostgres = false;
}

let tableInitialized = false;

async function ensureTable() {
    if (!usePostgres || tableInitialized) return;
    await sql`
        CREATE TABLE IF NOT EXISTS bariq_state (
            key TEXT PRIMARY KEY,
            data JSONB NOT NULL
        );
    `;
    tableInitialized = true;
}

async function dbGet(key, fallback) {
    await ensureTable();
    const result = await sql`SELECT data FROM bariq_state WHERE key = ${key}`;
    if (result.rows.length === 0) {
        if (fallback !== undefined) {
            await dbSet(key, fallback);
            return fallback;
        }
        return fallback;
    }
    return result.rows[0].data;
}

async function dbSet(key, data) {
    await ensureTable();
    await sql`
        INSERT INTO bariq_state (key, data)
        VALUES (${key}, ${data})
        ON CONFLICT (key) DO UPDATE SET data = ${data};
    `;
}

function fileGet(filePath, fallback) {
    ensureFileExists(filePath, fallback);
    return safeReadJSON(filePath, fallback);
}

function fileSet(filePath, data) {
    return safeWriteJSON(filePath, data);
}

async function loadProducts() {
    if (usePostgres) return dbGet("products", defaultProducts);
    return fileGet(PRODUCTS_FILE, defaultProducts);
}

async function saveProducts(products) {
    if (usePostgres) return dbSet("products", products);
    return fileSet(PRODUCTS_FILE, products);
}

async function loadDiscounts() {
    if (usePostgres) return dbGet("discounts", defaultDiscounts);
    return fileGet(DISCOUNTS_FILE, defaultDiscounts);
}

async function saveDiscounts(discounts) {
    if (usePostgres) return dbSet("discounts", discounts);
    return fileSet(DISCOUNTS_FILE, discounts);
}

async function loadOrders() {
    if (usePostgres) return dbGet("orders", []);
    return fileGet(ORDERS_FILE, []);
}

async function saveOrders(orders) {
    if (usePostgres) return dbSet("orders", orders);
    return fileSet(ORDERS_FILE, orders);
}

async function clearOrders() {
    if (usePostgres) return dbSet("orders", []);
    return fileSet(ORDERS_FILE, []);
}

module.exports = {
    loadProducts,
    saveProducts,
    loadDiscounts,
    saveDiscounts,
    loadOrders,
    saveOrders,
    clearOrders,
    usePostgres
};

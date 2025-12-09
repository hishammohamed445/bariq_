const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_PATH, 'products.json');
const DISCOUNTS_FILE = path.join(DATA_PATH, 'discounts.json');
const ORDERS_FILE = path.join(DATA_PATH, 'orders.json');

const ensureFileExists = (filePath, fallbackData) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(fallbackData, null, 2), 'utf8');
    }
};

const safeReadJSON = (filePath, fallback) => {
    try {
        ensureFileExists(filePath, fallback);
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw || '[]');
    } catch (error) {
        console.error(`Failed to read ${filePath}:`, error);
        return Array.isArray(fallback) ? fallback : [];
    }
};

const safeWriteJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Failed to write ${filePath}:`, error);
        return false;
    }
};

module.exports = {
    PRODUCTS_FILE,
    DISCOUNTS_FILE,
    ORDERS_FILE,
    safeReadJSON,
    safeWriteJSON,
    ensureFileExists
};

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
        description: "ساعة كلاسية بتصميم رفيع وأنيق للرجال",
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

module.exports = {
    defaultProducts,
    defaultDiscounts
};

// src/utils/gtm.js

export const pushToDataLayer = (eventName, payload = {}) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];

        // Clear previous ecommerce object to prevent data bleeding
        window.dataLayer.push({ ecommerce: null });

        window.dataLayer.push({
            event: eventName,
            ...payload,
        });
    }
};

// Ecommerce Event: View Single Book Details
export const trackViewItem = (book) => {
    if (!book) return;

    pushToDataLayer('view_item', {
        ecommerce: {
            currency: 'BDT',
            value: Number(book.price) || 0,
            items: [
                {
                    item_id: book._id,
                    item_name: book.title,
                    item_category: book.category || 'Books',
                    item_author: book.author || '',
                    price: Number(book.price) || 0,
                    quantity: 1,
                },
            ],
        },
    });
};

// Ecommerce Event: Order / Add to Cart
export const trackAddToCart = (book, quantity = 1) => {
    if (!book) return;

    pushToDataLayer('add_to_cart', {
        ecommerce: {
            currency: 'BDT',
            value: (Number(book.price) || 0) * quantity,
            items: [
                {
                    item_id: book._id,
                    item_name: book.title,
                    item_category: book.category || 'Books',
                    price: Number(book.price) || 0,
                    quantity: quantity,
                },
            ],
        },
    });
};
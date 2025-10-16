export const mapWooToProductRows = (woo) => {
    return {
        id: woo.id,
        title: woo.name,
        price: woo.price,
        stock_status: woo.stock_status || 'instock',
        stock_quantity: woo.stock_quantity != null ? Number(woo.stock_quantity) : null,
        category: woo.categories && woo.categories.length > 0 ? woo.categories[0].name : null,
        tags: woo.tags ? woo.tags.map((t) => t.name) : [],
        on_sale: woo.on_sale || false,
        created_at: woo.date_created ? new Date(woo.date_created) : null
    };
};

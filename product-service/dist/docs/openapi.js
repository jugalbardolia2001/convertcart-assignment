export const openapiSpec = {
    openapi: "3.0.0",
    info: {
        title: "Product Service API",
        version: "1.0.0",
        description: "APIs for ingesting and querying products",
    },
    servers: [
        { url: "http://localhost:4000", description: "Local" }
    ],
    paths: {
        "/health": {
            get: {
                summary: "Health check",
                responses: {
                    200: {
                        description: "Service is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products": {
            get: {
                summary: "List all products",
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ProductsResponse" }
                            }
                        }
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" }
                            }
                        }
                    }
                }
            }
        },
        "/products/ingest": {
            get: {
                summary: "Trigger WooCommerce ingestion manually",
                responses: {
                    200: {
                        description: "Ingestion triggered",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        total: { type: "integer" }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            Product: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    price: { type: "string", description: "WooCommerce price can be string" },
                    stock_status: { type: "string", enum: ["instock", "outofstock", "onbackorder"] },
                    stock_quantity: { type: "integer", nullable: true },
                    category: { type: "string", nullable: true },
                    tags: { type: "array", items: { type: "string" } },
                    on_sale: { type: "boolean" },
                    created_at: { type: "string", format: "date-time", nullable: true }
                },
                required: ["id", "title", "price", "stock_status", "on_sale", "tags"]
            },
            ProductsResponse: {
                type: "object",
                properties: {
                    total: { type: "integer" },
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" }
                    }
                },
                required: ["total", "data"]
            },
            Error: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            }
        }
    }
};

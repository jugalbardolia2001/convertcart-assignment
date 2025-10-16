export const openapiSpec = {
    openapi: "3.0.0",
    info: {
        title: "Segment Service API",
        version: "1.0.0",
        description: "APIs for segment evaluation using text-based rules",
    },
    servers: [
        { url: "http://localhost:4001", description: "Local" }
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
                                        status: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/segments/evaluate": {
            post: {
                summary: "Evaluate segmentation rules",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["rules"],
                                properties: {
                                    rules: { type: "string", description: "One condition per line" }
                                },
                                example: {
                                    rules: "price > 5000\nstock_status = instock\ncategory = Smartphones\nstock_quantity >= 5\nbrand != Samsung"
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Filtered list of products",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Product" }
                                }
                            }
                        }
                    },
                    400: {
                        description: "Invalid rule syntax or validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" }
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
                    price: { type: "string" },
                    stock_status: { type: "string", enum: ["instock", "outofstock", "onbackorder"] },
                    stock_quantity: { type: "integer", nullable: true },
                    category: { type: "string", nullable: true },
                    tags: { type: "array", items: { type: "string" } },
                    on_sale: { type: "boolean" },
                    created_at: { type: "string", format: "date-time", nullable: true }
                },
                required: ["id", "title", "price", "stock_status", "on_sale", "tags"]
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

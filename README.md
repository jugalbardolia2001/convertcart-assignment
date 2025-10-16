# ConvertCart Take-Home Assignment

This project demonstrates a microservice-based architecture built using **Node.js**, **Express**, **Sequelize** and **PostgreSQL**.

## Microservices
- product-service - handles WooCommerce product ingestion.
- segment-service - handles segment evaluation and filtering using text-based rules.
- client(Frontend UI) - provides a simple UI to evaluate rules and display results.

## 🚀 Tech Stack
- Node.js 18+
- TypeScript
- Express.js
- PostgreSQL
- Sequelize ORM
- Swagger (OpenAPI Spec)
- Docker
- npm

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL
- Docker (optional)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/jugalbardolia2001/convertcart-assignment.git
```

2. Install dependencies in each service:
```bash
npm install
```

3. Set environment variables:
```bash
# Create .env file in each service directory
# Copy .env.example to .env in each service directory
```

4. Start the services:
```bash
# Start product-service
npm run build && npm start
swagger docs - https://product-service-0142.onrender.com/docs/
.env.example
PRODUCT_SERVICE_PORT=4000

DATABASE_HOST=postgres
POSTGRES_DB=convertcart
POSTGRES_USER=postgres
DATABASE_PORT=5432
POSTGRES_PASSWORD=postgres

# WooCommerce creds
WC_BASE_URL=your-woocommerce-url
WC_CONSUMER_KEY=your-consumer-key
WC_CONSUMER_SECRET=your-consumer-secret


# Start segment-service
npm run build && npm start
swagger docs - https://segment-service-k9do.onrender.com/docs/
.env.example
SEGMENT_SERVICE_PORT=4001
PRODUCT_SERVICE_URL=https://product-service-0142.onrender.com

# Start client
npm run dev
.env.example
# production
VITE_PRODUCT_SERVICE_URL=https://product-service-0142.onrender.com
VITE_SEGMENT_SERVICE_URL=https://segment-service-k9do.onrender.com

5. ## Description of Ingestion Logic
product-service ingests products from WooCommerce and stores them in PostgreSQL database.
# //create description of ingestion logic
Runs periodically using node-cron every 6 hours
Fetches latest products from WooCommerce API
Stores products in PostgreSQL database
Normalizes product data structure and Converts WooCommerce data format to internal schema

# For Manual Products Ingestion using API
https://product-service-0142.onrender.com/products/ingest

6. Sample input for segmentation
### Rule Format
# The segment service evaluates products based on text-based rules. Here are some examples:
price > 0
stock_status = instock
stock_quantity >= 1
on_sale = true

### Sample Input Body (raw/JSON)
{
  "rules": "price > 0\nstock_status = instock\nstock_quantity >= 1\non_sale = true"
}

7. # Links to live frontend/backend demos (please wait for a few mins to load backend deployed on render)
Frontend - https://convertcart-assignment.vercel.app/
Product Service - https://product-service-0142.onrender.com/health
Segment Service - https://segment-service-k9do.onrender.com/health

8. # 🐳 Docker Setup Guide
# This guide explains how to set up and run the application using Docker and Docker Compose.
# Dockerfile is provided for each service. 
# Docker Compose file is named docker-compose.yml
# set environment variables in .env file as per .env.example
# Docker Compose Usage
To Build and start the application, run the following command:
```bash
docker-compose up --build
```
# Stop services
```bash
docker-compose down
```

# then start frontend using cd client
```bash
cd client
npm run dev
```

9. AI Usage Notes
# Which tool you used
- chatgpt and Windsurf
# What it generated
- Speed up boilerplate code generation and basic server setup.
- to generate swagger docs.
- to generate basic and minimal frontend UI.
- Help in validate ideas and provide insights.
- to generate dockerfile and docker-compose.yml.
# What you modified or improved yourself
- Fixed and improved the logic as well as buggy code.
- All AI-generated code was reviewed and tested manually

    







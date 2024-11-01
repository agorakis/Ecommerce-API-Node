-- CreateIndex
CREATE FULLTEXT INDEX `products_name_description_idx` ON `products`(`name`, `description`);

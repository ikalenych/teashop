import { test, expect } from "@playwright/test";

test.describe("Shopping Cart", () => {
  test("should add product to cart and verify in sidebar", async ({ page }) => {
    // Відкрити головну сторінку
    await page.goto("/");

    // Перейти в каталог
    await page.click("text=Collections");
    await expect(page).toHaveURL(/\/collections/);

    // Дочекатись завантаження товарів
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Клікнути на перший товар
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Дочекатись сторінки товару
    await page.waitForLoadState("networkidle");

    // Клікнути кнопку "Add to Bag"
    const addToCartButton = page.locator('[data-testid="add-to-cart-btn"]');
    await addToCartButton.click();

    // Дочекатись появи sidebar з товаром
    await page.waitForTimeout(1000);

    // Перевірити що в sidebar є товар
    const cartItems = page.locator('[data-testid="cart-item"]');
    const cartItemCount = await cartItems.count();

    expect(cartItemCount).toBeGreaterThan(0);
    console.log(`Cart has ${cartItemCount} item(s) in sidebar`);
  });

  test("should add product and verify on cart page", async ({ page }) => {
    // Відкрити головну сторінку
    await page.goto("/");

    // Перейти в каталог
    await page.click("text=Collections");
    await expect(page).toHaveURL(/\/collections/);

    // Дочекатись завантаження товарів
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Клікнути на перший товар
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Дочекатись сторінки товару
    await page.waitForLoadState("networkidle");

    // Клікнути кнопку "Add to Bag"
    const addToCartButton = page.locator('[data-testid="add-to-cart-btn"]');
    await addToCartButton.click();

    // Дочекатись появи sidebar
    await page.waitForTimeout(1000);

    // ТЕПЕР перейти на сторінку кошика
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/cart/);

    // Перевірити що товар є на сторінці кошика
    const cartItems = page.locator('[data-testid="cart-item"]');
    const cartItemCount = await cartItems.count();

    expect(cartItemCount).toBeGreaterThan(0);
    console.log(`Cart page has ${cartItemCount} item(s)`);

    // Перевірити що відображається "Order summery"
    const pageContent = await page.textContent("body");
    expect(pageContent).toContain("Order summery");
  });

  test("should display empty cart message when cart is empty", async ({
    page,
  }) => {
    // Перейти на сторінку кошика БЕЗ додавання товарів
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/cart/);

    // Перевірити що відображається повідомлення про пустий кошик
    const pageContent = await page.textContent("body");
    expect(pageContent).toContain("Your bag is empty");
  });
});

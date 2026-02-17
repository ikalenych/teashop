import { test, expect } from "@playwright/test";

test.describe("Catalog Filtering", () => {
  test("should filter tea products by category", async ({ page }) => {
    // Відкрити головну сторінку
    await page.goto("/");

    // Перейти в каталог
    await page.click("text=Collections");
    await expect(page).toHaveURL(/\/collections/);

    // Дочекатись завантаження товарів
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Підрахувати кількість товарів до фільтрації
    const productsBeforeFilter = await page
      .locator('[data-testid="product-card"]')
      .count();
    console.log(`Products before filter: ${productsBeforeFilter}`);
    expect(productsBeforeFilter).toBeGreaterThan(0);

    // Клікнути на LABEL "Black Tea" (не на чекбокс!)
    await page.click("text=Black Tea");

    // Дочекатись зміни URL
    await page.waitForURL(/category=black-tea/, { timeout: 5000 });

    // Дочекатись ререндеру товарів
    await page.waitForTimeout(1000);

    // Підрахувати товари після фільтрації
    const productsAfterFilter = await page
      .locator('[data-testid="product-card"]')
      .count();
    console.log(`Products after filter: ${productsAfterFilter}`);

    expect(productsAfterFilter).toBeGreaterThan(0);

    // Перевірити текст "products found"
    const productsFoundText = await page.textContent(
      "text=/\\d+ products found/",
    );
    console.log(productsFoundText);
    expect(productsFoundText).toContain("products found");
  });

  test("should display correct product information", async ({ page }) => {
    // Відкрити каталог напряму
    await page.goto("/collections");

    // Дочекатись завантаження товарів
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Перевірити перший товар
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toBeVisible();

    // Зображення
    const productImage = firstProduct.locator("img");
    await expect(productImage).toBeVisible();

    // Ціна
    const price = page.locator("text=/€\\d+\\.\\d+/").first();
    await expect(price).toBeVisible();
  });

  test("should navigate using direct category URL", async ({ page }) => {
    // Перейти напряму по URL з фільтром
    await page.goto("/collections?category=black-tea");

    // Дочекатись завантаження товарів
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Перевірити що товари є
    const productCount = await page
      .locator('[data-testid="product-card"]')
      .count();
    console.log(`Products in Black Tea category: ${productCount}`);

    expect(productCount).toBeGreaterThan(0);

    // Перевірити що чекбокс "Black Tea" активний
    const blackTeaCheckbox = page
      .locator("text=Black Tea")
      .locator("..")
      .locator('input[type="checkbox"]');
    expect(await blackTeaCheckbox.isChecked()).toBeTruthy();
  });
});

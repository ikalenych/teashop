// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Очищаємо БД
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Створюємо тестового користувача
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
    },
  });

  console.log("✅ User created:", user.email);

  // BLACK TEA (2 товари)
  await prisma.product.create({
    data: {
      name: "Earl Grey Black Tea",
      slug: "earl-grey-black-tea",
      description: "Classic black tea infused with bergamot oil",
      category: "black-tea",
      stock: 80,
      origin: { country: "India", region: "Assam" },
      flavor: ["citrus", "floral", "bold"],
      caffeine: "high",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["energy-boost", "focus"],
      ingredients: "Black tea, bergamot oil",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3",
      brewingInfo: {
        temperature: "95-100°C",
        time: "3-5 minutes",
        amount: "2.5g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 7.99, stock: 40 },
          { weight: "100g", price: 13.99, stock: 40 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "English Breakfast Black Tea",
      slug: "english-breakfast-black-tea",
      description: "Full-bodied traditional morning blend",
      category: "black-tea",
      stock: 90,
      origin: { country: "Sri Lanka", region: "Ceylon" },
      flavor: ["malty", "robust", "sweet"],
      caffeine: "high",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["energy-boost"],
      ingredients: "Ceylon black tea",
      imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9",
      brewingInfo: {
        temperature: "100°C",
        time: "3-5 minutes",
        amount: "2.5g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 6.99, stock: 45 },
          { weight: "100g", price: 12.49, stock: 45 },
        ],
      },
    },
  });

  // GREEN TEA (2 товари)
  await prisma.product.create({
    data: {
      name: "Sencha Green Tea",
      slug: "sencha-green-tea",
      description: "Premium Japanese green tea with delicate, refreshing taste",
      category: "green-tea",
      stock: 100,
      origin: { country: "Japan", region: "Shizuoka" },
      flavor: ["grassy", "sweet", "umami"],
      caffeine: "medium",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["antioxidant", "metabolism-boost"],
      ingredients: "100% green tea leaves",
      imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9",
      brewingInfo: {
        temperature: "70-80°C",
        time: "2-3 minutes",
        amount: "2g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 8.99, stock: 50 },
          { weight: "100g", price: 15.99, stock: 50 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Jasmine Green Tea",
      slug: "jasmine-green-tea",
      description: "Fragrant green tea with jasmine blossoms",
      category: "green-tea",
      stock: 85,
      origin: { country: "China", region: "Fujian" },
      flavor: ["floral", "sweet", "delicate"],
      caffeine: "low",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["relaxation", "antioxidant"],
      ingredients: "Green tea, jasmine flowers",
      imageUrl: "https://images.unsplash.com/photo-1597318115096-6b8a783c0b4a",
      brewingInfo: {
        temperature: "75-80°C",
        time: "2-3 minutes",
        amount: "2g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 9.99, stock: 40 },
          { weight: "100g", price: 17.99, stock: 45 },
        ],
      },
    },
  });

  // WHITE TEA (2 товари)
  await prisma.product.create({
    data: {
      name: "Silver Needle White Tea",
      slug: "silver-needle-white-tea",
      description: "Rare and delicate premium white tea",
      category: "white-tea",
      stock: 60,
      origin: { country: "China", region: "Fujian" },
      flavor: ["subtle", "sweet", "honey"],
      caffeine: "low",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["antioxidant", "anti-aging"],
      ingredients: "White tea buds",
      imageUrl: "https://images.unsplash.com/photo-1563822249366-7c8b560076fe",
      brewingInfo: {
        temperature: "70-75°C",
        time: "4-5 minutes",
        amount: "2.5g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 14.99, stock: 30 },
          { weight: "100g", price: 26.99, stock: 30 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "White Peony Tea",
      slug: "white-peony-tea",
      description: "Smooth white tea with subtle fruity notes",
      category: "white-tea",
      stock: 70,
      origin: { country: "China", region: "Fujian" },
      flavor: ["mild", "fruity", "floral"],
      caffeine: "low",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["calming", "antioxidant"],
      ingredients: "White tea leaves and buds",
      imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
      brewingInfo: {
        temperature: "75-80°C",
        time: "3-4 minutes",
        amount: "2g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 11.99, stock: 35 },
          { weight: "100g", price: 20.99, stock: 35 },
        ],
      },
    },
  });

  // MATCHA (2 товари)
  await prisma.product.create({
    data: {
      name: "Ceremonial Grade Matcha",
      slug: "ceremonial-grade-matcha",
      description: "Premium ceremonial matcha from Uji, Japan",
      category: "matcha",
      stock: 50,
      origin: { country: "Japan", region: "Uji" },
      flavor: ["umami", "sweet", "creamy"],
      caffeine: "high",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["focus", "energy", "antioxidant"],
      ingredients: "Stone-ground green tea powder",
      imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7",
      brewingInfo: {
        temperature: "70-80°C",
        time: "whisk 30 seconds",
        amount: "2g per 100ml",
      },
      variants: {
        create: [
          { weight: "30g", price: 24.99, stock: 25 },
          { weight: "50g", price: 38.99, stock: 25 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Culinary Matcha",
      slug: "culinary-matcha",
      description: "Perfect for lattes, smoothies and baking",
      category: "matcha",
      stock: 80,
      origin: { country: "Japan", region: "Kagoshima" },
      flavor: ["vegetal", "slightly-bitter"],
      caffeine: "high",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["energy", "metabolism-boost"],
      ingredients: "Green tea powder",
      imageUrl: "https://images.unsplash.com/photo-1536013616002-c2c7838703b3",
      brewingInfo: {
        temperature: "70-80°C",
        time: "whisk 30 seconds",
        amount: "2g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 16.99, stock: 40 },
          { weight: "100g", price: 29.99, stock: 40 },
        ],
      },
    },
  });

  // HERBAL TEA (2 товари)
  await prisma.product.create({
    data: {
      name: "Chamomile Herbal Tea",
      slug: "chamomile-herbal-tea",
      description: "Soothing caffeine-free chamomile flowers",
      category: "herbal-tea",
      stock: 95,
      origin: { country: "Egypt", region: "Nile Delta" },
      flavor: ["floral", "honey", "apple"],
      caffeine: "none",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["relaxation", "sleep", "calming"],
      ingredients: "Chamomile flowers",
      imageUrl: "https://images.unsplash.com/photo-1587554128031-f4d0c783a3e0",
      brewingInfo: {
        temperature: "100°C",
        time: "5-7 minutes",
        amount: "2-3g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 5.99, stock: 50 },
          { weight: "100g", price: 10.99, stock: 45 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Peppermint Herbal Tea",
      slug: "peppermint-herbal-tea",
      description: "Refreshing pure peppermint leaves",
      category: "herbal-tea",
      stock: 100,
      origin: { country: "USA", region: "Oregon" },
      flavor: ["minty", "cool", "fresh"],
      caffeine: "none",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["digestive", "refreshing"],
      ingredients: "Peppermint leaves",
      imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721",
      brewingInfo: {
        temperature: "100°C",
        time: "5-7 minutes",
        amount: "2g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 6.49, stock: 50 },
          { weight: "100g", price: 11.49, stock: 50 },
        ],
      },
    },
  });

  // CHAI (2 товари)
  await prisma.product.create({
    data: {
      name: "Masala Chai",
      slug: "masala-chai",
      description: "Traditional Indian spiced black tea",
      category: "chai",
      stock: 75,
      origin: { country: "India", region: "Assam" },
      flavor: ["spicy", "sweet", "warming"],
      caffeine: "medium",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["warming", "energy"],
      ingredients:
        "Black tea, cinnamon, cardamom, ginger, cloves, black pepper",
      imageUrl: "https://images.unsplash.com/photo-1597318130823-f934c1dfc5b0",
      brewingInfo: {
        temperature: "100°C",
        time: "5 minutes",
        amount: "3g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 7.49, stock: 40 },
          { weight: "100g", price: 13.49, stock: 35 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Vanilla Chai",
      slug: "vanilla-chai",
      description: "Smooth chai with creamy vanilla notes",
      category: "chai",
      stock: 80,
      origin: { country: "India", region: "Kerala" },
      flavor: ["vanilla", "spicy", "creamy"],
      caffeine: "medium",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["comforting", "smoothing"],
      ingredients: "Black tea, vanilla, cinnamon, cardamom, ginger",
      imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
      brewingInfo: {
        temperature: "100°C",
        time: "4-5 minutes",
        amount: "2.5g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 8.49, stock: 40 },
          { weight: "100g", price: 15.49, stock: 40 },
        ],
      },
    },
  });

  // OOLONG (2 товари)
  await prisma.product.create({
    data: {
      name: "Tie Guan Yin Oolong",
      slug: "tie-guan-yin-oolong",
      description: "Premium Chinese oolong with floral notes",
      category: "oolong",
      stock: 60,
      origin: { country: "China", region: "Fujian" },
      flavor: ["floral", "creamy", "sweet"],
      caffeine: "medium",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["relaxation", "digestive"],
      ingredients: "100% oolong tea leaves",
      imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
      brewingInfo: {
        temperature: "85-95°C",
        time: "3-4 minutes",
        amount: "3g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 12.99, stock: 30 },
          { weight: "100g", price: 22.99, stock: 30 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Milk Oolong",
      slug: "milk-oolong",
      description: "Creamy oolong with natural milky flavor",
      category: "oolong",
      stock: 70,
      origin: { country: "Taiwan", region: "Alishan" },
      flavor: ["creamy", "buttery", "sweet"],
      caffeine: "medium",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["smoothing", "digestive"],
      ingredients: "Oolong tea leaves",
      imageUrl: "https://images.unsplash.com/photo-1545835797-84d93338a1f7",
      brewingInfo: {
        temperature: "85-90°C",
        time: "3-4 minutes",
        amount: "3g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 11.99, stock: 35 },
          { weight: "100g", price: 20.99, stock: 35 },
        ],
      },
    },
  });

  // ROOIBOS (2 товари)
  await prisma.product.create({
    data: {
      name: "Pure Rooibos",
      slug: "pure-rooibos",
      description: "Naturally sweet South African red bush tea",
      category: "rooibos",
      stock: 90,
      origin: { country: "South Africa", region: "Cederberg" },
      flavor: ["sweet", "nutty", "earthy"],
      caffeine: "none",
      organic: true,
      vegan: true,
      allergens: [],
      qualities: ["calming", "antioxidant"],
      ingredients: "Rooibos leaves",
      imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
      brewingInfo: {
        temperature: "100°C",
        time: "5-7 minutes",
        amount: "2.5g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 6.99, stock: 45 },
          { weight: "100g", price: 12.49, stock: 45 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Vanilla Rooibos",
      slug: "vanilla-rooibos",
      description: "Smooth rooibos with vanilla bean",
      category: "rooibos",
      stock: 85,
      origin: { country: "South Africa", region: "Cederberg" },
      flavor: ["vanilla", "sweet", "creamy"],
      caffeine: "none",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: ["relaxation", "comforting"],
      ingredients: "Rooibos, vanilla",
      imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9",
      brewingInfo: {
        temperature: "100°C",
        time: "5-7 minutes",
        amount: "2.5g per 200ml",
      },
      variants: {
        create: [
          { weight: "50g", price: 7.99, stock: 40 },
          { weight: "100g", price: 13.99, stock: 45 },
        ],
      },
    },
  });

  // TEAWARE (2 товари)
  await prisma.product.create({
    data: {
      name: "Glass Teapot 500ml",
      slug: "glass-teapot-500ml",
      description: "Heat-resistant borosilicate glass teapot with infuser",
      category: "teaware",
      stock: 30,
      origin: { country: "Germany", region: "Bavaria" },
      flavor: [],
      caffeine: "none",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: [],
      ingredients: "Borosilicate glass, stainless steel",
      imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
      brewingInfo: { temperature: "N/A", time: "N/A", amount: "N/A" },
      variants: {
        create: [{ weight: "500ml", price: 24.99, stock: 30 }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Bamboo Tea Scoop",
      slug: "bamboo-tea-scoop",
      description: "Traditional handcrafted bamboo matcha scoop (chashaku)",
      category: "teaware",
      stock: 50,
      origin: { country: "Japan", region: "Kyoto" },
      flavor: [],
      caffeine: "none",
      organic: false,
      vegan: true,
      allergens: [],
      qualities: [],
      ingredients: "Natural bamboo",
      imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9",
      brewingInfo: { temperature: "N/A", time: "N/A", amount: "N/A" },
      variants: {
        create: [{ weight: "1pc", price: 8.99, stock: 50 }],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export const getUniqueValues = (products: any[], key: string): string[] => {
  if (key === "origin") {
    const origins = products.flatMap((p) => p.origin);
    return Array.from(new Set(origins)).sort();
  }

  if (key === "flavor") {
    const allFlavors = products.flatMap((p) => p.flavor);
    return Array.from(new Set(allFlavors)).sort();
  }

  // category
  const values = products.map((p) => p[key]);
  return Array.from(new Set(values)).sort();
};

export const filterProducts = (products: any[], filters: any): any[] => {
  return products.filter((product) => {
    // Category
    if (
      filters.categories &&
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    // Origin
    if (
      filters.origins &&
      filters.origins.length > 0 &&
      !filters.origins.some((o: string) => product.origin.includes(o))
    ) {
      return false;
    }

    // Flavor
    if (
      filters.flavors &&
      filters.flavors.length > 0 &&
      !filters.flavors.some((flavor: string) => product.flavor.includes(flavor))
    ) {
      return false;
    }

    // Caffeine
    if (
      filters.caffeines &&
      filters.caffeines.length > 0 &&
      !filters.caffeines.includes(product.caffeine)
    ) {
      return false;
    }

    // Organic
    if (filters.organic && !product.organic) {
      return false;
    }

    return true;
  });
};

export const sortProducts = (products: any[], sortBy: string): any[] => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);

    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);

    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    default:
      return sorted;
  }
};

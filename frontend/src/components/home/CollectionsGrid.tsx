import { Link } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9";

const collections = [
  { name: "Black Tea", slug: "black-tea", image: PLACEHOLDER_IMAGE },
  { name: "Green Tea", slug: "green-tea", image: PLACEHOLDER_IMAGE },
  { name: "White Tea", slug: "white-tea", image: PLACEHOLDER_IMAGE },
  { name: "Matcha", slug: "matcha", image: PLACEHOLDER_IMAGE },
  { name: "Herbal Tea", slug: "herbal-tea", image: PLACEHOLDER_IMAGE },
  { name: "Chai", slug: "chai", image: PLACEHOLDER_IMAGE },
  { name: "Oolong", slug: "oolong", image: PLACEHOLDER_IMAGE },
  { name: "Rooibos", slug: "rooibos", image: PLACEHOLDER_IMAGE },
  { name: "Teaware", slug: "teaware", image: PLACEHOLDER_IMAGE },
];

export const CollectionsGrid = () => {
  return (
    <section id="collections" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-prosto text-3xl text-center mb-12 text-primary">
          Our Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              to={`/collections?category=${collection.slug}`}
              className="group block overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square overflow-hidden bg-background-variant">
                <img
                  src={collection.image}
                  alt={collection.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 bg-background">
                <h3 className="font-montserrat font-semibold text-center uppercase tracking-wider text-sm text-primary group-hover:text-secondary transition-colors">
                  {collection.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

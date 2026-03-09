import { Link } from "react-router-dom";

const collections = [
  {
    name: "Black Tea",
    slug: "black-tea",
    image:
      "https://img.freepik.com/free-photo/black-tea-with-dry-tea-teapot-wooden-surface-side-view_176474-6302.jpg?semt=ais_user_personalization&w=740&q=80",
  },
  {
    name: "Green Tea",
    slug: "green-tea",
    image:
      "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "White Tea",
    slug: "white-tea",
    image:
      "https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Matcha",
    slug: "matcha",
    image:
      "https://images.pexels.com/photos/5946670/pexels-photo-5946670.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Herbal Tea",
    slug: "herbal-tea",
    image:
      "https://images.pexels.com/photos/1581484/pexels-photo-1581484.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Chai",
    slug: "chai",
    image:
      "https://images.pexels.com/photos/5946608/pexels-photo-5946608.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Oolong",
    slug: "oolong",
    image:
      "https://images.pexels.com/photos/8963883/pexels-photo-8963883.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Rooibos",
    slug: "rooibos",
    image:
      "https://images.pexels.com/photos/5947014/pexels-photo-5947014.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Teaware",
    slug: "teaware",
    image:
      "https://images.pexels.com/photos/4029709/pexels-photo-4029709.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
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

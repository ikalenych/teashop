import { Button } from "../common/Button";

export const WholesalerSection = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Текст ЛІВОРУЧ - 50% */}
          <div className="flex items-center px-8 md:px-16 py-16">
            <div className="space-y-6 max-w-lg">
              <h2 className="font-prosto text-3xl md:text-4xl text-primary">
                For Wholesalers
              </h2>

              <p className="font-montserrat text-sm leading-relaxed text-primary">
                We offer loose tea leaves of the best quality for your business.
                With a choice of more than 450 different kinds of loose tea, we
                can make a sophisticated selection that fits exactly in your
                kind of establishment.
              </p>

              <Button variant="outline" theme="primary">
                Get a Free Consultation
              </Button>
            </div>
          </div>

          {/* Фото ПРАВОРУЧ - 50% */}
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256"
              alt="Tea cup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

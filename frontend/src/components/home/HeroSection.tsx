import { Button } from "../common/Button";

const handleClick = () => {
  const element = document.getElementById("collections");
  element?.scrollIntoView({ behavior: "smooth" });
};

export const HeroSection = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Фото ЛІВОРУЧ - 50% */}
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9"
              alt="Tea spoons"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center px-8 md:px-16 py-16">
            <div className="space-y-6 max-w-lg">
              <h1 className="font-prosto text-4xl md:text-5xl leading-tight text-primary">
                Every day is unique,
                <br />
                just like our tea
              </h1>

              <p className="font-montserrat text-sm leading-relaxed text-primary">
                Lorem ipsum dolor sit amet consectetur. Orci nibh nullam mauris
                adipiscing nisi. Neque lacus nisl ornare risus ultricies nunc.
                Sed dictum enim ut risus ornare nullam. Nisl at faucibus sed.
              </p>

              <p className="font-montserrat text-sm leading-relaxed text-primary">
                Lorem ipsum dolor sit amet consectetur. Orci nibh nullam mauris
                adipiscing nisi. Neque lacus nisl ornare risus ultricies nunc.
              </p>

              <Button onClick={handleClick} variant="filled" theme="primary">
                Browse Teas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

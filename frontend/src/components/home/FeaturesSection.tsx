import { Leaf, Award, Truck, Gift } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Leaf, title: "450+ kind of loose tea" },
  { icon: Award, title: "Certificated organic teas" },
  { icon: Truck, title: "Free delivery" },
  { icon: Gift, title: "Sample for all teas" },
];

export const FeaturesSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/about");
  };

  return (
    <section className="py-12 bg-background-variant">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3"
              >
                <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-montserrat font-semibold text-xs uppercase tracking-wide text-primary">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" theme="primary" onClick={handleClick}>
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

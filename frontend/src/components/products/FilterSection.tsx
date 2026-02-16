import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  defaultOpen?: boolean;
}

export const FilterSection = ({
  title,
  options,
  selectedValues,
  onChange,
  defaultOpen = true,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (options.length === 0) return null;

  // Додає або видаляє значення з масиву
  const handleToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      // Видаляємо
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      // Додаємо
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="border-b border-outline pb-4">
      {/* Header (клікабельний) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h4 className="font-montserrat font-semibold text-sm uppercase text-primary">
          {title}
        </h4>

        {/* Іконка +/- */}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-primary transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-primary transition-transform" />
        )}
      </button>

      {/* Випадаючий список з анімацією */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="space-y-2 pb-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer group hover:bg-background-variant px-2 py-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleToggle(option)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="font-montserrat text-sm text-primary group-hover:text-secondary capitalize">
                  {option.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

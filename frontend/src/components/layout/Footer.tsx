export const Footer = () => {
  return (
    <footer className="bg-background-variant py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-montserrat font-semibold text-sm uppercase mb-4 text-primary">
              Collections
            </h3>
            <ul className="space-y-2 text-sm font-montserrat text-primary">
              <li>
                <a href="#" className="hover:text-secondary">
                  Black tea
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Green tea
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  White tea
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat font-semibold text-sm uppercase mb-4 text-primary">
              Learn
            </h3>
            <ul className="space-y-2 text-sm font-montserrat text-primary">
              <li>
                <a href="#" className="hover:text-secondary">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  About our teas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Tea academy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat font-semibold text-sm uppercase mb-4 text-primary">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm font-montserrat text-primary">
              <li>
                <a href="#" className="hover:text-secondary">
                  Ordering and payment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-montserrat font-semibold text-sm uppercase mb-4 text-primary">
              Contact Us
            </h3>
            <p className="text-sm font-montserrat text-primary">
              3 Falahi Yani St., Fatoarkor Ave,
              <br />
              Shiraz, Fars Providence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

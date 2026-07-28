function Features() {
  return (
    <section className="bg-gray-100 py-16">

      <h2 className="text-4xl font-bold text-center mb-12">
        Why Choose FreightIQ?
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">
            🚀 Fast Quotes
          </h3>
          <p>
            Get instant freight quotations within seconds using AI-powered
            pricing.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">
            📦 Secure Shipping
          </h3>
          <p>
            Safe and reliable freight management for all shipment types.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">
            🤖 AI Pricing
          </h3>
          <p>
            Machine learning predicts accurate freight prices based on shipment
            details.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;
import QuoteForm from "./QuoteForm";

function Hero() {
  return (
    <section className="bg-slate-900 text-white min-h-screen flex items-center">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-8">

        {/* Left Side */}

        <div>

          <p className="uppercase text-blue-300 font-semibold mb-4">
            AI Powered Freight Pricing
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Intelligent Freight
            <br />
            Quote Generation
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Get instant freight quotations using AI. Fast, secure
            and accurate pricing for every shipment.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">
            Get Started
          </button>

        </div>

        {/* Right Side */}

        <QuoteForm />

      </div>

    </section>
  );
}

export default Hero;
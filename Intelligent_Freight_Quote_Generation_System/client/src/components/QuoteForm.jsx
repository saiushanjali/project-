function QuoteForm() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 text-black">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Get Instant Quote
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="From"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="To"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Weight (Kg)"
          className="w-full border rounded-lg p-3"
        />

        <select className="w-full border rounded-lg p-3">
          <option>Select Cargo Type</option>
          <option>General</option>
          <option>Fragile</option>
          <option>Perishable</option>
          <option>Hazardous</option>
        </select>

        <select className="w-full border rounded-lg p-3">
          <option>Select Transport Mode</option>
          <option>Road</option>
          <option>Rail</option>
          <option>Air</option>
          <option>Sea</option>
        </select>

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Generate Quote
        </button>

      </div>

    </div>
  );
}

export default QuoteForm;
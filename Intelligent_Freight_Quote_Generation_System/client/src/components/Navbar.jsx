function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-700">
          FreightIQ
        </h1>

        <ul className="flex gap-8 font-medium">
          <li className="cursor-pointer hover:text-blue-600">Home</li>
          <li className="cursor-pointer hover:text-blue-600">Services</li>
          <li className="cursor-pointer hover:text-blue-600">About</li>
          <li className="cursor-pointer hover:text-blue-600">Contact</li>
        </ul>

        <button className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800">
          Login
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
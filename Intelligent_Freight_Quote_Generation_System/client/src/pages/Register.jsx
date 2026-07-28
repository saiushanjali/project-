import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px]">

        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Register
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
          Register
        </button>

        <p className="text-center mt-5">
          Already have an account?
          <Link
            to="/login"
            className="text-green-600 font-semibold ml-2"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Login
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-3 rounded-lg mb-5"
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Login
        </button>

        <p className="text-center mt-5">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 font-semibold ml-2"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
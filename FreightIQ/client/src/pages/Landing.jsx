import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import SlaNetwork from "../components/SlaNetwork";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <SlaNetwork />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
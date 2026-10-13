import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SearchX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <SearchX className="text-slate-300 w-20 h-20 mb-6 shrink-0" />
        <h1 className="text-8xl font-bold font-heading text-slate-200 mb-2 mt-0 leading-none">404</h1>
        <h2 className="text-2xl font-heading text-slate-600 mb-3 mt-0">Page not found</h2>
        <p className="text-slate-400 mb-8 max-w-md m-0">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className="btn-primary flex items-center gap-2 no-underline px-6 border-0 cursor-pointer">
          <Home className="w-5 h-5 shrink-0" /> Go Back Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}

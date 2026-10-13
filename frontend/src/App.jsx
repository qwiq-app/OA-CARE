import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatbotWidget from "./components/ChatbotWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import AboutOA from "./pages/AboutOA";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminExerciseStatus from "./pages/admin/AdminExerciseStatus";
import AdminExercises from "./pages/admin/AdminExercises";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminUsers from "./pages/admin/AdminUsers";
import Counselling from "./pages/Counselling";
import Diagnosis from "./pages/Diagnosis";
import ExerciseDetail from "./pages/ExerciseDetail";
import Exercises from "./pages/Exercises";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NonPharma from "./pages/NonPharma";
import PatientDashboard from "./pages/PatientDashboard";
import PharmaMgmt from "./pages/PharmaMgmt";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import Symptoms from "./pages/Symptoms";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutOA />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/counselling" element={<Counselling />} />
          <Route path="/pharmacological" element={<PharmaMgmt />} />
          <Route path="/non-pharmacological" element={<NonPharma />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExerciseDetail />} />
          <Route
            path="/faq"
            element={
              <ErrorBoundary title="Something went wrong loading the FAQ.">
                <FAQ />
              </ErrorBoundary>
            }
          />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exercises"
            element={
              <ProtectedRoute adminOnly>
                <AdminExercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exercise-status"
            element={
              <ProtectedRoute adminOnly>
                <AdminExerciseStatus />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}

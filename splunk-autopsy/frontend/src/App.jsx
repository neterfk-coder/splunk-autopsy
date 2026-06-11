import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Dashboard from "./pages/Dashboard";
import InvestigationView from "./pages/InvestigationView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import "./styles/global.css";

export default function App() {
  const [investigation, setInvestigation] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const path = window.location.pathname;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  // Auth routes
  if (path === "/login") return <Login />;
  if (path === "/register") return <Register />;
  if (path === "/forgot-password") return <ForgotPassword />;

  return (
    <div className="app">
      {investigation ? (
        <InvestigationView
          data={investigation}
          onBack={() => setInvestigation(null)}
        />
      ) : (
        <Dashboard onInvestigation={setInvestigation} session={session} />
      )}
    </div>
  );
}

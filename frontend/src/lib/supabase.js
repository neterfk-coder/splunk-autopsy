import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Guardar investigación
export async function saveInvestigation(userId, question, result) {
  const { error } = await supabase.from("investigations").insert({
    user_id: userId,
    question,
    status: result.status,
    causal_chain: result.causal_chain,
    timeline: result.timeline,
    report: result.report,
    queries_executed: result.queries_executed,
  });

  if (error) console.error("Error saving investigation:", error);
}

// Guardar actividad
export async function logActivity(userId, action, details = {}, page = "/") {
  const { error } = await supabase.from("activity_log").insert({
    user_id: userId,
    action,
    details,
    page,
  });

  if (error) console.error("Error logging activity:", error);
}

// Obtener historial de investigaciones
export async function getInvestigations(userId) {
  const { data, error } = await supabase
    .from("investigations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching investigations:", error);
  return data || [];
}

// Actualizar último acceso del usuario
export async function updateLastSeen(userId) {
  const { error } = await supabase
    .from("profiles")
    .update({ last_seen: new Date().toISOString() })
    .eq("id", userId);

  if (error) console.error("Error updating last seen:", error);
}

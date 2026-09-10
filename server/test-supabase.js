import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

console.log("URL:", url);
console.log("Key exists:", !!key);
console.log("Key length:", key?.length);

const supabase = createClient(url, key);

try {
  const { data, error } = await supabase.auth.signUp({
    email: `test${Date.now()}@example.com`,
    password: "TestPassword123!",
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);
} catch (err) {
  console.error("REQUEST FAILED:", err);
}
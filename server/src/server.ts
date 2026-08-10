import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MEDIGUIDE API running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
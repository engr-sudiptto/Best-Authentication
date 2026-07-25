import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = 4000;

// ---- database functon call -----
connectDB()

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
import app from "./src/app.js";
import connectDB from "./src/config/database.js";


const PORT = 4000;

connectDB()

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
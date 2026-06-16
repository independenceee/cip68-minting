import express from "express";
import cors from "cors";
import router from "./routes/index.route";

const app = express();

app.use(cors());
app.use(express.json());

router(app)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;

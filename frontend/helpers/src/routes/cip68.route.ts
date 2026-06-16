import { Router } from "express";
import cip68 from "../controllers/cip68.controller"

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Chào từ Express chạy trên Bun!", platform: "Vercel" });
});
router.route("/mint").post(cip68.mint);
router.route("/burn").post(cip68.burn);
router.route("/update").post(cip68.update);

export default router;

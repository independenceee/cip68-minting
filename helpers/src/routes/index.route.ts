import { Express } from "express";

import cip68 from "./cip68.route"

const router = function(app: Express) {
    app.use("/api/v0/cip68", cip68)
}

export default router;
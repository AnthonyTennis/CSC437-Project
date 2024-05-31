// src/index.ts
// src/index.ts
import express, { Request, Response } from "express";
import profiles from "./routes/profiles";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";
import path from "path";

connect("ProjectDB");
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

const nodeModules = path.resolve(
__dirname,
"../../proto/node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", express.static(nodeModules));

app.use(express.json());
app.use("/api/profiles", authenticateUser, profiles);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/auth", auth);

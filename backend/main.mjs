import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

const app = express();
const db = new Database("./data.sqlite");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );
`);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/sign_up", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.prepare("INSERT INTO users (username, password) VALUES (?, ?);").run([username, password]);
    res.json("Added new user");
});

app.post("/sign_in", (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;

    const user = db.prepare("SELECT * FROM users WHERE username=?").get([username]);

    if (user == null) {
        res.status(404).json("No user found");
        return;
    }

    if (password != user.password) {
        res.status(401).json("Invalid password, ks amk");
        return;
    }

    res.json(user);
});

app.get("/", (req, res) => {
    const users = db.prepare("SELECT * FROM users;").all();
    res.json(users);
});

app.get("*", (req, res) => {
    res.status(404).json({
        message: "ro7 ntak"
    });
});

app.listen(3000, "127.0.0.1", () => {
    console.log("App running http://127.0.0.1:3000");
});

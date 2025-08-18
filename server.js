const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

app.use(cors("*"));
app.use(bodyParser.json());
app.use(express.json());

const server = http.createServer(app);

const UserName = "admin";
const Password = "admin@1234";

const SECRETKEY = "this_is_secret_key";
// const io = new Server(server)

const io = new Server(server, {
    cors: {
        // origin: 'http://192.168.1.7:3000',
        // methods: ['GET', 'POST']
        origin: "*", // or '*' during dev
        methods: ["GET", "POST"],
    },
});

app.use(express.static(path.join(__dirname, "public")));

let onlineUsers = new Set();

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    onlineUsers.add(socket.id);

    socket.on("join", (name) => {
        console.log("user joined", name);
        socket.username = name;
        io.emit("online-users", Array.from(onlineUsers));
    });

    socket.on("chat message", (msg) => {
        console.log(onlineUsers)
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);

        if (socket.username) {
            onlineUsers.delete(socket.username);
            io.emit("online-users", Array.from(onlineUsers));
        }
    });
});

//login route and Api
app.post("/login", (req, res) => {
    const { name, password } = req.body;

    if (name === UserName && password === Password) {
        const token = jwt.sign({ name }, SECRETKEY, { expiresIn: "5h" });
        return res.status(200).json({ token });
    }

    return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Token" });

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRETKEY);
        res.status(200).json({ name: decoded.name });
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
});

server.listen(4000, () => {
    console.log("server is running on http://192.168.1.6:4000");
});

const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const cors = require("cors")
const dotenv = require("dotenv");


const app = express()
app.use(cors())

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("joinRoom", room => socket.join(room))
    socket.on("newMsg", ({ newMsg, room }) => {
        console.log(room, newMsg)
        io.in(room).emit("getLtstMsg", newMsg)
    })
});

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.get("/", (req, res) => {
    res.send("socket chat backend started")
})


server.listen(PORT, () => console.log(`app started at PORT ${PORT}`))
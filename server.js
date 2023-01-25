import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const serverHttp = http.createServer(app);

app.use(cors());

serverHttp.listen(6010, () => {
	console.log("listening on *:6010");
});

// Static files
//app.use(express.static("public"));

// Socket setup & pass server

const io = new Server(serverHttp, {
	cors: {
		origins: "*",
		methods: ["GET", "POST"],
	},
});

const roomList = [];
io.on("connection", (socket) => {
	console.log("made socket connection", socket.id);

	// Create room array
	socket.on("join", function (data) {
		console.log("Joined");
		console.log(data);
		const fromId = data.clientId + data.handle;
		if (!roomList.find((val) => val === fromId)) {
			roomList.push(fromId);
		}
		console.log(fromId);
	});

	// Handle chat event
	socket.on("chat", function (data) {
		console.log(roomList);
		console.log(data.message);

		roomList.forEach((element) => {
			if (element.match(data.chatBuddy)) {
				const roomToSend = element.replace(`${data.chatBuddy}`, "");
				socket.to(roomToSend).emit("chat", data);
			}
		});
		//To send to all clients
		//io.sockets.emit("chat", data);
	});

	// Handle typing event
	socket.on("typing", function (data) {
		roomList.forEach((element) => {
			if (element.match(data.chatBuddy)) {
				const roomToSend = element.replace(`${data.chatBuddy}`, "");
				socket.to(roomToSend).emit("typing", data);
			}
		});
	});
});

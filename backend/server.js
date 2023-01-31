import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const serverHttp = http.createServer(app);

let conversationObj = [];

app.use(cors());
//mongo db
import mongoose from "mongoose";
import Conversation from "../backend/models/conversationModel.js";
mongoose.connect(
	"mongodb+srv://masahe:proj3ChatApp@cluster0.tyjub9p.mongodb.net/test",
	console.log("Connected to db")
);

serverHttp.listen(6010, () => {
	console.log("listening on *:6010");
});

// Static files
//app.use(express.static("public"));

// Socket setup & pass server

function arrayRemove(arr, value) {
	return arr.filter(function (ele) {
		return ele != value;
	});
}

const io = new Server(serverHttp, {
	cors: {
		origins: "*",
		methods: ["GET", "POST"],
	},
});

let roomList = [];
let userList = [];
io.on("connection", (socket) => {
	console.log("made socket connection", socket.id);

	// Create room array
	socket.on("join", function (data) {
		console.log("Joined", data);
		const fromId = data.clientId + data.handle;
		if (!roomList.find((val) => val === fromId)) {
			roomList.push(fromId);
			userList.push(data.handle);
		}
		console.log(roomList);
		console.log("Online...", userList);
		io.sockets.emit("onlineUsers", userList);
	});

	//remove from room array if disconnected
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		console.log("before", roomList);
		roomList.forEach((element) => {
			if (element.match(socket.id)) {
				console.log("found", element);
				roomList = arrayRemove(roomList, element);
				const discUser = element.slice(20);
				console.log("removed user", discUser);
				userList = arrayRemove(userList, discUser);
			}
		});
		io.sockets.emit("onlineUsers", userList);
		console.log("after", roomList);
	});

	// Handle chat event
	socket.on("chat", async function (data) {
		let roomToSend;
		let roomFrom;

		//console.log(roomList);
		//console.log(data.message);

		roomList.forEach((element) => {
			if (element.match(data.chatBuddy)) {
				roomToSend = element.replace(`${data.chatBuddy}`, "");
				//socket.to(roomToSend).emit("chat", data);
			}
			console.log("Room to send", roomToSend);
		});
		roomList.forEach((element) => {
			if (element.match(data.handle)) {
				roomFrom = element.replace(`${data.handle}`, "");
			}
			console.log("from room", roomFrom);
		});

		//To send to all clients
		//io.sockets.emit("chat", data);
		//write to db
		conversationObj.push({
			sender: data.handle,
			receiver: data.chatBuddy,
			content: {
				userName: data.handle,
				msg: data.message,
			},
		});
		console.log("conversation Obj", conversationObj);
		//await Conversation.create(conversationObj);
		//conversationObj = [];

		let convObjFrmDb = await Conversation.find({
			sender: { $in: [data.handle, data.chatBuddy] },
			receiver: { $in: [data.chatBuddy, data.handle] },
		});
		console.log("conv obj from DB", convObjFrmDb);
		if (convObjFrmDb.length === 0) {
			console.log("EMPTY");
			await Conversation.create(conversationObj);
			conversationObj = [];
			convObjFrmDb = [];
		} else {
			convObjFrmDb.find(async (e) => {
				console.log("entedred FrmDb");
				if (
					(e.sender === data.handle && e.receiver === data.chatBuddy) ||
					(e.sender === data.chatBuddy && e.receiver === data.handle)
				) {
					console.log("documet exist");
					console.log(e._id);
					await Conversation.updateOne(
						{ _id: e.id },
						{
							$push: {
								content: { userName: data.handle, msg: data.message },
							},
						}
					);
				}

				// data = { message: e.content, handle: e.sender };
				// console.log(data);
				// socket.to(roomToSend).emit("chat", data);

				conversationObj = [];
				convObjFrmDb = [];
				//console.log(e.sender, e.receiver);
			});
		}
		//read from db and send to client
		let convObjFrmDbToSend = await Conversation.find({
			sender: { $in: [data.handle, data.chatBuddy] },
			receiver: { $in: [data.chatBuddy, data.handle] },
		});
		convObjFrmDbToSend.map((e) => {
			// console.log(e.content);
			data = { message: e.content };
		});
		// socket.to([roomToSend, roomFrom]).emit("chat", data);
		io.to(roomToSend).to(roomFrom).emit("chat", data);
		//console.log(data);
	});

	//// Handle typing event
	//socket.on("typing", function (data) {
	//	roomList.forEach((element) => {
	//		if (element.match(data.chatBuddy)) {
	//			const roomToSend = element.replace(`${data.chatBuddy}`, "");
	//			socket.to(roomToSend).emit("typing", data);
	//		}
	//	});
	//});
});

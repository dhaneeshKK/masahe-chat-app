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
let roomToSend;
io.on("connection", (socket) => {
	console.log("made socket connection", socket.id);

	// Create room array
	socket.on("join", function (data) {
		console.log("Joined", data);
		const fromId = data.clientId + data.handle;
		if (!roomList.find((val) => val === fromId)) {
			roomList.push(fromId);
		}
		console.log(roomList);
	});

	//remove from room array if disconnected
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		console.log("before", roomList);
		roomList.forEach((element) => {
			if (element.match(socket.id)) {
				console.log("found", element);
				roomList = arrayRemove(roomList, element);
			}
		});
		console.log("after", roomList);
	});

	// Handle chat event
	socket.on("chat", async function (data) {
		//console.log(roomList);
		//console.log(data.message);

		roomList.forEach((element) => {
			if (element.match(data.chatBuddy)) {
				roomToSend = element.replace(`${data.chatBuddy}`, "");
				//socket.to(roomToSend).emit("chat", data);
			}
		});
		//To send to all clients
		//io.sockets.emit("chat", data);
		//write to db
		conversationObj.push({
			sender: data.handle,
			receiver: data.chatBuddy,
			content: data.message,
		});
		console.log(conversationObj);
		//await Conversation.create(conversationObj);
		//conversationObj = [];

		let convObjFrmDb = await Conversation.find({
			sender: { $in: data.handle },
			receiver: { $in: data.chatBuddy },
		});
		console.log(convObjFrmDb);
		if (convObjFrmDb.length === 0) {
			console.log("EMPTY");
			await Conversation.create(conversationObj);
		} else {
			convObjFrmDb.find(async (e) => {
				console.log("entedred FrmDb");
				if (e.sender === data.handle && e.receiver === data.chatBuddy) {
					console.log("documet exist");
					console.log(e._id);
					await Conversation.updateOne(
						{ _id: e.id },
						{
							$push: {
								content: data.message,
							},
						}
					);
				}

				data = { message: e.content, handle: e.sender };
				console.log(data);
				socket.to(roomToSend).emit("chat", data);

				conversationObj = [];
				convObjFrmDb = [];
				//console.log(e.sender, e.receiver);
			});
		}
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
/*
if (!)

const cursor = db.collection('conversationObj').find({
  sender: { $in: data.handle }
});

*/

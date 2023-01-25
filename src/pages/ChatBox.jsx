import React, { useEffect, useState } from "react";

let socket;
socket = io.connect("http://localhost:6010");

const ChatBox = () => {
	const [message, setMessage] = useState();
	const [handle, setHandle] = useState();
	const [chatBuddy, setChatBuddy] = useState();

	// useEffect(() => {
	// }, []);

	//		// Query DOM
	//		//const message = document.getElementById("message"),
	//		//	handle = document.getElementById("handle"),
	//		btn = document.getElementById("send"))
	//	,
	//		(btnJoin = document.getElementById("join")),
	//		(output = document.getElementById("output")),
	//		(feedback = document.getElementById("feedback")),
	//		(chatBuddy = document.getElementById("to"));

	// Emit events

	function joinFn(e) {
		e.preventDefault();
		socket.emit("join", {
			handle: handle,
			clientId: socket.id,
		});
	}

	function btn(e) {
		e.preventDefault();
		socket.emit("chat", {
			message: message,
			handle: handle,
			chatBuddy: chatBuddy,
			clientId: socket.id,
		});
		// message.value = "";
	}

	const dataFromSrvr = socket.on("chat", function (data) {
		// console.log(data.message);
	});
	console.log(dataFromSrvr);
	//message.addEventListener("keypress", function () {
	//	socket.emit("typing", {
	//		handle: handle.value,
	//		chatBuddy: to.value,
	//	});
	//});

	// Listen for events
	//socket.on("chat", function (data) {
	//	// feedback.innerHTML = "";
	//	output.innerHTML +=
	//		"<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
	//});

	//socket.on("typing", function (data) {
	//	feedback.innerHTML =
	//		"<p><em>" + data.handle + " is typing a message...</em></p>";
	//});

	return (
		<div>
			<br />
			<form onSubmit={joinFn}>
				<input
					placeholder="username"
					onChange={(e) => setHandle(e.target.value)}
					//onInput={(e) => setHandle(e.target.value)}
				/>

				<br />
				{/* <button onClick={() => joinFn()}>JOIN</button> */}
				<input type="submit" value="Join" />
			</form>
			<form onSubmit={btn}>
				<br />
				<input
					placeholder="chatBuddy"
					onChange={(e) => setChatBuddy(e.target.value)}
				/>
				<br />
				<input
					placeholder="message"
					onChange={(e) => setMessage(e.target.value)}
				/>
				<br />
				<input type="submit" value="Send" />
			</form>
		</div>
	);
};

export default ChatBox;

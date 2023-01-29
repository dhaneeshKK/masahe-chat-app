import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const ChatBox = () => {
	const [message, setMessage] = useState();
	const [handle, setHandle] = useState();
	const [chatBuddy, setChatBuddy] = useState();
	const [msgFrmSrvr, setMsgFrmSrv] = useState([]);
	const [msgFrm, setMsgFrm] = useState();

	useEffect(() => {
		socket = io.connect("http://localhost:6010");
		socket.on("connect", () => {
			console.log("Connected to socket server");
		});
	}, []);

	// Emit events

	function joinChat(e) {
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
	}

	useEffect(() => {
		socket.on("chat", function (data) {
			console.log("from server", data.message);
			console.log(JSON.stringify(data.message));
			setMsgFrmSrv(JSON.stringify(data.message));
			console.log(typeof msgFrmSrvr);
			// setMsgFrm(data.handle);
		});
	}, []);

	//message.addEventListener("keypress", function () {
	//	socket.emit("typing", {
	//		handle: handle.value,
	//		chatBuddy: to.value,
	//	});
	//});

	//socket.on("typing", function (data) {
	//	feedback.innerHTML =
	//		"<p><em>" + data.handle + " is typing a message...</em></p>";
	//});

	return (
		<div className="border-red-500">
			<br />
			<form onSubmit={joinChat}>
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
			<span> {msgFrmSrvr}</span>
			{/*<span>
				{Object.keys(msgFrmSrvr).map((key) => (
					<h4>
						{key} : {msgFrmSrvr[key]}{" "}
					</h4>
				))}
				</span>*/}
		</div>
	);
};

export default ChatBox;

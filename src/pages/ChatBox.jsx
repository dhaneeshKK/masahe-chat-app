import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const ChatBox = () => {
	const [message, setMessage] = useState();
	const [handle, setHandle] = useState();
	const [chatBuddy, setChatBuddy] = useState();
	const [msgFrmSrvr, setMsgFrmSrvr] = useState([]);
	const [onlineUsr, setOnlineUsr] = useState([]);

	useEffect(() => {
		socket = io.connect("http://localhost:6010");
		socket.on("connect", () => {
			console.log("Connected to socket server");
		});
	}, []);

	useEffect(() => {
		socket.on("onlineUsers", function (userList) {
			console.log("online users", userList);
			setOnlineUsr(userList);
		});
	});

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
			setMsgFrmSrvr(data.message);
		});
	}, []);

	useEffect(() => {
		socket.on("onlineUsers", function (userList) {
			console.log("online users", userList);
			setOnlineUsr(userList);
		});
	}, [onlineUsr]);

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
		<div className="flex flex-col items-center  space-y-4 flex-wrap">
			<br />
			<form onSubmit={joinChat}>
				<input
					placeholder="username"
					className="input input-bordered input-secondary w-full max-w-xs "
					onChange={(e) => setHandle(e.target.value)}
					//onInput={(e) => setHandle(e.target.value)}
				/>

				<br />
				{/* <button onClick={() => joinFn()}>JOIN</button> */}
				{/* <input type="submit" value="Join" /> */}
				<button className="btn btn-primary" type="submit" value="Join">
					Join
				</button>
			</form>
			<form onSubmit={btn}>
				<br />
				{/*<input
					placeholder="chatBuddy"
					className="input input-bordered input-secondary w-full max-w-xs"
					onChange={(e) => setChatBuddy(e.target.value)}
	/>*/}
				<br />
				<input
					placeholder="message"
					className="input input-bordered input-secondary w-full max-w-xs"
					onChange={(e) => setMessage(e.target.value)}
				/>
				<br />
				{/* <input type="submit" value="Send" /> */}
				<button className="btn btn-primary" type="submit" value="Send">
					Send
				</button>
			</form>

			<div className="card w-80 bg-neutral text-neutral-content">
				<div className="card-body items-center text-center">
					<h2 className="card-title">Chat</h2>
					{/* <p>{msgFrmSrvr}</p> */}

					{msgFrmSrvr &&
						msgFrmSrvr.map((u) => (
							<p>
								{u.userName} : {u.msg}
							</p>
						))}

					<div className="card-actions justify-end"></div>
				</div>
			</div>

			<div className="card w-80 bg-primary text-primary-content">
				<div className="card-body items-center text-center">
					<h2 className="card-title">Online Users</h2>
					<p>
						{onlineUsr.map((e) => (
							<ol>
								{
									<button
										class="btn rounded-full"
										onClick={() => setChatBuddy(e)}
									>
										{e}
									</button>
								}
							</ol>
						))}
					</p>

					<div className="card-actions justify-end"></div>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const ChatBox = () => {
	const [message, setMessage] = useState();
	const [handle, setHandle] = useState();
	const [chatBuddy, setChatBuddy] = useState();
	const [msgFrmSrvr, setMsgFrmSrvr] = useState([]);
	const [onlineUsr, setOnlineUsr] = useState([]);
	const [socket, setSocket] = useState();
	const [joined, setJoined] = useState(false);
	useEffect(() => {
		//setSocket(io.connect("http://localhost:6010"));
		const newSocket = io.connect("http://localhost:6010");
		setSocket(newSocket);
		function usersOnline(userList) {
			console.log("online users", userList);
			setOnlineUsr(userList);
		}
		newSocket.on("onlineUsers", usersOnline);
		newSocket.on("connect", () => {
			console.log("Connected to socket server");
		});
		newSocket.on("chat", function (data) {
			console.log("from server", data.message);
			setMsgFrmSrvr(data.message);
		});
		return () => {
			setSocket(null);
			newSocket.removeAllListeners("connect");
			newSocket.removeAllListeners("chat");
			newSocket.off("onlineUsers", usersOnline);
			console.log("un mouting componenet");
		};
	}, []);

	console.log(onlineUsr);
	// Emit events

	function joinChat(e) {
		e.preventDefault();
		socket.emit("join", {
			handle: handle,
			clientId: socket.id,
		});
		setJoined(true);
	}

	function leaveChat(e) {
		e.preventDefault();
		socket.emit("leave", socket.id);
		console.log("leaving chat");
		setJoined(false);
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

	return (
		<div className="flex flex-row items-center  space-y-4 flex-wrap">
			<br />
			<div className="flex flex-col items-center flex-wrap">
				<form onSubmit={!joined ? joinChat : leaveChat}>
					<input
						placeholder="username"
						className="input input-bordered input-secondary w-full max-w-xs "
						onChange={(e) => setHandle(e.target.value)}
						//onInput={(e) => setHandle(e.target.value)}
					/>

					<br />
					{/* <button onClick={() => joinFn()}>JOIN</button> */}
					{/* <input type="submit" value="Join" /> */}
					{/* <button className="btn btn-primary" type="submit" value="Join"> */}
					{/* Join */}
					{/* </button> */}

					<button className="btn btn-primary">
						{!joined ? "Join Chat " : "Leave Chat"}
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
			</div>
			<div className="card w-40 bg-primary text-primary-content">
				<div className="card-body items-center text-center">
					<h2 className="card-title">Online Users</h2>
					<p>
						{onlineUsr.map((e) => (
							<>
								{
									<button
										className="btn rounded-full"
										onClick={() => setChatBuddy(e)}
									>
										{e}
									</button>
								}
							</>
						))}
					</p>

					<div className="card-actions justify-end"></div>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;

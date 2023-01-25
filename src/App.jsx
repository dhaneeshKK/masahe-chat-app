import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ChatBox from "./pages/ChatBox";
import Home from "./pages/Home";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />

			<Route path="/chatbox" element={<ChatBox />} />
		</Routes>
	);
}

export default App;

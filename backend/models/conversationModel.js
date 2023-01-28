import mongoose from "mongoose";
const { Schema, model } = mongoose;

const conversationSchema = new Schema([
	{
		sender: { type: String },

		content: { type: String, trim: true },

		receiver: { type: String },
	},
]);
const Conversation = model("Conversation", conversationSchema);

export default Conversation;

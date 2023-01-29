import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const { Schema, model } = mongoose;

const conversationSchema = Schema([
	{
		sender: { type: String },

		content: { type: Array },

		receiver: { type: String },
	},
]);
const Conversation = model("Conversation", conversationSchema);

export default Conversation;

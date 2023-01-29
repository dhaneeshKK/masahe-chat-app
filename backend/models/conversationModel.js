import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const { Schema, model } = mongoose;

const conversationSchema = Schema([
	{
		sender: { type: String },
		receiver: { type: String },
		content: { type: Array },
	},
]);
const Conversation = model("Conversation", conversationSchema);

export default Conversation;

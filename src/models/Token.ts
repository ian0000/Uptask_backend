import mongoose, { Document, Schema, Types } from "mongoose";
import { token } from "morgan";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createdAt: Date;
}

const tockenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const Token = mongoose.model<IToken>("Token", tockenSchema);
export default Token;

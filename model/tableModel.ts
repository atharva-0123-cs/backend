
import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    text: String,
    description: String,
    status: { type: Boolean, default: false },
    dueDate: Date,
  },
  { timestamps: true }
);

const Table = mongoose.models.Table || mongoose.model("Table", tableSchema);

export default Table;

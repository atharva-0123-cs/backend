import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    id: Number,
    title : String,
    price: Schema.Types.Decimal128,
    description: String,
    category: String,
    image : String,
    sold: Boolean,
    dateOfSale: Date,
  },
  {timestamps : true}
);

const Table = mongoose.models.Table || mongoose.model("Table", tableSchema);

export default Table;

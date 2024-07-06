const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routerGetBank = require("./routes/getbank");
const app = express();
app.use(cors());
app.use(express.json());
async function connect() {
  //mongodb+srv://oninecv:i6G0omrkIWsyKG8R@cluster0.nhxhbsl.mongodb.net/
  try {
    await mongoose.connect(
      "mongodb+srv://trinhcongtrieu2972002:trieutct@trieu.q6n63sn.mongodb.net/",
      { useNewUrlParser: true }
    );
    console.log("Mongoose connect succsess");
  } catch (error) {
    console.log(error);
  }
}
connect();
app.use("/api", routerGetBank);
const PORT = process.env.PORT || 9986;
app.listen(PORT, () => {
  console.log("NodeJs is running PORT ", PORT);
});

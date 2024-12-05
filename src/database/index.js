import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  const connectionUrl =
    "mongodb+srv://shwetanigam2106:Nigam%402002@cluster0.vvxzb.mongodb.net/MallifyIQ"; 

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("MallifyIQ database connected successfully!"))
    .catch((err) =>
      console.log(`Getting Error from DB connection: ${err.message}`)
    );
};

export default connectToDB;

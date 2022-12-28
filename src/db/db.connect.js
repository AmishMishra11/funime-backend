import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connectToMongoose = async () => {
  try {
    mongoose.connect(
      // process.env.MONGODB_URI || "mongodb://localhost:9000 ",

      "mongodb+srv://AmishMishra11:Amish%40123@cluster0.k4jw2os.mongodb.net/funime",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );

    console.log("connected to db successfully");
  } catch (e) {
    console.log("error occured: ", e);
  }
};

export { connectToMongoose };

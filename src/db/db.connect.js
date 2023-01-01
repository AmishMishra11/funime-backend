import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connectToMongoose = async () => {
  try {
    mongoose.connect(process.env.MONGOOSE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("connected to db successfully");
  } catch (e) {
    console.log("error occured: ", e);
  }
};

export { connectToMongoose };

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    console.log(
      `MongoDB Connected: PrepPilot`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
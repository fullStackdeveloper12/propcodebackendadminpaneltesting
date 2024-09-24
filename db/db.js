import mongoose from "mongoose";

// DataBase Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`DataBase Connected Successfully`);
  } catch (error) {
    console.log(`Failed to Connect DataBase : ${error}`);
  }
};

// Export
export default connectDB;
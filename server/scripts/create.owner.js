import { userModel as User } from "../models/user.model.js";
import dotenv from "dotenv";
import { encryptPassword } from "../utils/hash.password.js";
dotenv.config();

export const createOwner = async () => {
  try {
    const ownerData = {
      username: process.env.OWNER_USERNAME,
      password: await encryptPassword(process.env.OWNER_PASSWORD),
      role: process.env.OWNER_ROLE,
      parentId: null,
      balance: 100000,
    };

    const owner = await User.findOne({ role: "OWNER" });
    if (owner) {
      owner.username = ownerData.username;
      owner.password = ownerData.password;
      owner.balance = ownerData.balance;

      await owner.save();
      console.log("OWNER already exists — updated successfully");
    } else {
      await User.create(ownerData);
      console.log("OWNER created successfully");
    }
  } catch (error) {
    console.error("Error", error.message);
  }
};

import bcryptjs from "bcryptjs";

export const encryptPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export const decryptPassword = async (password, comparePassword) => {
  return await bcryptjs.compare(password, comparePassword);
};


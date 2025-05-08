import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the token
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

export default generateToken;

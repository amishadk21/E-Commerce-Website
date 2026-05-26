import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import authRouter from "./auth.js";
import productRouter from "./product.js"
import cartRouter from "./cart.js"


export var app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth",authRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)


// ✅ FIXED: Typo in console.loglog
app.post("/product/add", (req, res) => {
  console.log(req.headers); // FIXED

 const token = req.headers.authorization;

jwt.verify(token, secret, (err, decodedPayload) => {
  if (err) {
    res.status(401).json({ error: true, message: "Invalid or missing token/forbidden" });
    return 
  }

  console.log("Decoded Payload=", decodedPayload);
  res.send("product working");
});
});

app.listen(3000);
//Basic Authentication Token 
//Bearer Authentication Token - Json Web Token (jwt)

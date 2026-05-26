import jwt from "jsonwebtoken";
import express from "express";
import { connection } from "./connection.js";

var router = express.Router();

// ✅ FIXED: Secret must not be empty
export const secret = "acmeIntern";
console.log("Nodemon will reflect immediate");

router.post("/signup", (req, res) => {
  console.log("Received Body =", req.body);
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    res.status(400).json({ message: "Missing inputs in request", error: true });
    return;
  }

  const dbQuery = "INSERT INTO user(username, password, role) VALUES (?, ?, ?)";
  const dbValues = [username, password, role];

  connection.query(dbQuery, dbValues, (err, dbResult) => {
    if (err) {
      res.status(500).json({ error: true, message: "something went wrong" });
      return;
    }

    res.status(201).json({ error: false, message: "signup successful" });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: true, message: "Missing inputs" });
    return;
  }

  const dbQuery = "SELECT * FROM user WHERE username=? AND password=?";
  const dbValues = [username, password];

  connection.query(dbQuery, dbValues, (err, dbResult) => {
    if (err) {
      res.status(500).json({ error: true, message: "something went wrong" });
      return;
    }

    if (dbResult.length == 0) {
      res.status(401).json({ error: true, message: "Unauthorized" });
      return;
    } else {
      console.log(dbResult[0]);
      const payload = {
        username: dbResult[0].username,
        userid: dbResult[0].userid,
        role: dbResult[0].role,
      };

      // ✅ FIXED: Correct usage of jwt.sign
      const jwtToken = jwt.sign(payload, secret, { expiresIn: "0.5h" });

      console.log("JWT=", jwtToken);

      res.status(200).json({ error: false,data:payload, message: "Login Success", token: jwtToken });
    }
  });
});

export default router;

export function authGaurd(req, res, next) {
    const token=req.headers.authorization
    if (token) {
      jwt.verify(token, secret, (err, decodedPayload) => {
        if(err){
            res.json({error:true,message:"Invalid Token"})
            return
        } 
        req.user=decodedPayload
      
        //call the actual handler
        next();
      })
    }
    else {
       
    res.json({error:true,message:"no token found in headers"});
}
}

export function vendorGaurd(req,res,next){
    if(req.user.role.toLowerCase()!="vendor"){
        res.status(403).json({error:true,message:"Forbidden Access"});
        return
    }
    next()
}
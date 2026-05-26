import express from "express";
import { authGaurd } from "./auth.js";
import { connection } from "./connection.js";

var router = express.Router();
export default router;

// ✅ Define vendorGaurd middleware
function vendorGaurd(req, res, next) {
    if (req.user.role.toLowerCase() === "vendor") {
        res.status(403).json({ error: true, message: "Forbidden Access" });
        return;
    }
    next();
}

router.post("/add", authGaurd, vendorGaurd, (req, res) => {
    const { name, price, detail } = req.body;
    console.log("USER=", req.user);

    // ✅ Use comparison operator
    if (req.user.role.toLowerCase() === "vendor") {
        res.status(403).json({ error: true, message: "Forbidden Access" });
        return;
    }

    console.log("Received=", req.body);
    const dbQuery = `insert into product(name,price,detail,owner) values (?,?,?,?)`;
    const dbValues = [name, price, detail, req.user.userid];
    connection.query(dbQuery, dbValues, (err, dbResult) => {
        if (err) {
            res.json({ error: true, message: "Something Went Wrong" });
            return;
        }
        res.json({ error: false, message: "Product Added Successfully" });
    });
});

router.get("/view", authGaurd, (req, res) => {
    let dbQuery = "select * from product where owner=?";

    if(req.user.role.toLowerCase()!="customer"){
        dbQuery="select * from product"
    }
    const dbValues = [req.user.userid]


    
    connection.query(dbQuery,dbValues, (err, dbResult) => {
        if (err) {
            res.status(500).json({ error: true, message: "Something went wrong" });
            return;
        }
        console.log(dbResult);
        res.status(200).json({ error: false, message: "Product received Successfully", data: dbResult });
    });
});

router.post("/remove",authGaurd,vendorGaurd,(req,res)=>{

    const{pid}=req.body
    const dbQuery="delete from product where pid=?";
    const dbValues=[pid]

    connection.query(dbQuery,dbValues,(err,dbResult)=>{
        if(err){
            res.status(500).json({error:true,message:"Something went wrong"})
            return
        }
        res.status(200).json({error:false,message:"Product removed successfully"})  
    })
})
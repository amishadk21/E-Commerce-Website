import express from 'express';
import { connection} from "./connection.js";
import {authGaurd} from "./auth.js";

const router=express.Router();
export default router;

router.post("/add",authGaurd,(req,res)=>{

    const{pid}=req.body;
    const dbQuery="insert into cart(userid,pid) values(?,?)";
    const dbvalues=[req.user.userid,pid];

    connection.query(dbQuery,dbvalues,(err,result)=>{
        if(err){
            res.status(500).json({error:true,message:"Database error",});
            return
        }
        res.status(200).json({error:false,message:"Product added to cart successfully"});
    })
})

router.get("/view",authGaurd,(req,res)=>{
    const dbQuery="select * from cart join product on cart.pid=product.pid where userid=?";
    const dbValues=[req.user.userid];

    connection.query(dbQuery,dbValues,(err,dbResult)=>{
        if(err){
            console.log(err)
        res.status(500).json({error:true,message:"Database error",});
        return
}
        res.status(201).json({error:false,message:"Cart items fetched successfully!",data:dbResult})
})
})

router.post("/remove",authGaurd,(req,res)=>{
    const {cartid}=req.body;
    const dbQuery="delete from cart where cartid=?";
    const dbValues=[cartid]
    connection.query(dbQuery,dbValues,(err,dbResult)=>{
        if(err){
            console.log(err)
            res.status(500).json({error:true,message:"Database error",});
            return
        }
        res.status(200).json({error:false,message:"Item removed from cart successfully"});
    })
})

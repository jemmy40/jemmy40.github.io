const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */

app.use(express.static(path.join(__dirname)));

/* ================= TEST ROUTE ================= */

app.get("/api/test", (req, res) => {

res.json({
success: true,
message: "DexPi backend is running"
});

});

/* ================= PI CONFIG ================= */

const PI_API_KEY = process.env.PI_API_KEY;

app.get("/api/pi", (req, res) => {

res.json({
success: true,
apiKeyExists: !!PI_API_KEY
});

});

/* ================= NFT STORAGE ================= */

let nfts = [];

/* ================= GET NFTS ================= */

app.get("/api/nfts", (req, res) => {

res.json(nfts);

});

/* ================= CREATE NFT ================= */

app.post("/api/nfts", async (req, res) => {

try{

const {
name,
price,
rarity,
description,
image
} = req.body;

/* ================= VALIDATION ================= */

if(
!name ||
!price ||
!rarity ||
!description ||
!image
){

return res.status(400).json({
success:false,
message:"Missing fields"
});

}

/* ================= NFT OBJECT ================= */

const nft = {

id: Date.now(),

name,

price,

rarity,

description,

image,

createdAt: new Date()

};

/* ================= SAVE ================= */

nfts.push(nft);

/* ================= RESPONSE ================= */

res.json({
success:true,
message:"NFT created successfully",
nft
});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Server error"
});

}

});

/* ================= AXIOS ================= */

const axios = require("axios");

/* ================= PAYMENT APPROVAL ================= */

app.post("/api/approve-payment", async (req, res) => {

try{

const { paymentId } = req.body;

const response = await axios.post(

`https://api.minepi.com/v2/payments/${paymentId}/approve`,
{},

{
headers:{
Authorization: `Key ${PI_API_KEY}`
}
}

);

console.log("Payment approved");

res.json({
success:true,
data:response.data
});

}catch(error){

console.log(
error.response?.data || error.message
);

res.status(500).json({
success:false,
error:error.response?.data || error.message
});

}

});

/* ================= PAYMENT COMPLETE ================= */

app.post("/api/complete-payment", async (req, res) => {

try{

const {
paymentId,
txid
} = req.body;

const response = await axios.post(

`https://api.sandbox.minepi.com/v2/payments/${paymentId}/complete`,

{
txid: txid
},

{
headers:{
Authorization: `Key ${PI_API_KEY}`
}
}

);

console.log("Payment completed");

res.json({
success:true,
data:response.data
});

}catch(error){

console.log(
error.response?.data || error.message
);

res.status(500).json({
success:false,
error:error.response?.data || error.message
});

}

});

/* ================= INDEX ================= */

app.get("/", (req, res) => {

res.sendFile(
path.join(__dirname, "index.html")
);

});

/* ================= PORT ================= */

const PORT =
process.env.PORT || 3000;

/* ================= START ================= */

app.listen(PORT, () => {

console.log(
"DexPi server running on port " + PORT
);

});

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

/* ================= PAYMENT APPROVAL ================= */

app.post("/api/approve-payment", async (req, res) => {

try{

const { paymentId } = req.body;

console.log(
"Approve payment:",
paymentId
);

res.json({
success:true
});

}catch(error){

console.log(error);

res.status(500).json({
success:false
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

console.log(
"Complete payment:",
paymentId,
txid
);

res.json({
success:true
});

}catch(error){

console.log(error);

res.status(500).json({
success:false
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

const claudinary=require("cloudinary").v2;

const cloudName =process.env.cloudname;
const apiKey =process.env.cloude_apikey;
const apiSecret =process.env.cloude_secret;


claudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

module.exports=claudinary
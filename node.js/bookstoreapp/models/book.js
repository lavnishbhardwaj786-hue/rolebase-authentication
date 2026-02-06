const mongoose=require("mongoose");
const booksschema=new mongoose.Schema({
title:{
    type:String,
    required :[true,'book title is required '],// the compulsory property 
    maxLength:[100,"the length of book should be less than 100 "],// it fix the length of the title and write the second as instructions
    trim:true,// use to remove un neccessairy spaces in the input data 
},
author:{
    type:String,
    required :[true,'author name is required '],
    trim:true,
},
year:{
    type:Number,
    required:[true,'publication year is required '],
    min:[1000,'year must be at least 1000'],
    max:[new Date().getFullYear(),`don't go for future`],
}
});
const bookmodel=mongoose.model('books',booksschema);
module.exports=bookmodel;

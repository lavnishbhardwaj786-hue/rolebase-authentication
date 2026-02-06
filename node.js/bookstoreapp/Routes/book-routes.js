const express=require('express');
const {
    getallbooks,
    getsinglebookbyId,
    addnewbook,
    updatesinglebook,
    deletebookbyId}=require('../controllers/book-controller.js');
// create express router 
const router=express.Router()
// create all the routes required in book store 
// we don't need to run the server so we are using route insted of app
router.get('/get',getallbooks);
router.get('/get/:id',getsinglebookbyId);
router.post('/add',addnewbook);
router.put('/update/:id',updatesinglebook);
router.delete('/delete/:id',deletebookbyId);

module.exports=router;
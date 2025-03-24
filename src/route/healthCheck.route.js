const express=require('express')
const HealthController=require('../controllers/healthCheck_contoller.js');

const router=express.Router();
router.route('/test').post(HealthController);

module.exports=router;
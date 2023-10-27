/*IMPORT SECTION START */
const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
/*IMPORT SECTION END */
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1"


/* ############## QUERY SECTION START ####################*/
const client = new MongoClient(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function retrieveAllDrugList(){ return await client.db("DRUGS").collection("DRUGS").find({}).toArray();}

async function  insertDrug(item){
    return await client.db("DRUGS").collection("DRUGS").insertOne(item);
}

async function  updateDrugById(drugId, newItem){
    //TODO
}

async function  deleteDrugById(){
  return await client.db("DRUGS").collection("DRUGS").deleteMany({})
}
/* ############## QUERY SECTION END ####################*/



/* ######################### ROUTING SECTION #############################*/

const router = express.Router();
// GET MAPPING
/** GET ALL DATA  **/
router.get('/drugList',  async function(request, response){
    const drugList = await retrieveAllDrugList()
    response.send(drugList);
});

/** GET NOTIFICATION **/

router.get(`/notifications`, async function(request,response){
   const drugList = await retrieveAllDrugList();
   const current_date = new Date();
   let response_object = []; 
   for(let index=0; index< drugList.length; index++){
     response_object[index]=checkDates(drugList[index].drugExpirationDate, current_date, drugList[index].drugName);
   }
  
    response.send(response_object);
});



//POST MPPING
/** INSERT DATA **/

router.post('/insertDrug', async function(request, response){
    const respFromDb = await insertDrug(request.body);
    response.send(respFromDb);
});

//PUT MAPPING
/** UPDATE DATA BY ID **/
router.put('/updateDrug/drug_id', function(request, response){
    console.log("Request recieved: ", request);
    const respFromDb = updateDrugById(request.params(), request.body());
    response.send(respFromDb);
});

//DELETE MAPPING
/** DELETE DATA by ID **/
router.delete('/deleteDrug', function(request, response){
    console.log("Request recieved: ", request);
    const respFromDb = deleteDrugById();
    response.send(respFromDb);

});

router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});



function checkDates(expirationDate, currentDate, name) {
    const expirationDateObj = new Date(expirationDate);
    const currentDateObj = new Date(currentDate);
    const DIVIDER = (1000 * 60 * 60 * 24);
    const daysDifference = (expirationDateObj - currentDateObj) / DIVIDER

    if (expirationDateObj > currentDateObj) {return { "drugName": name, "daysToExpire": 0, "daysSinceExpired":daysDifference};}
    else {
      if (expirationDateObj.getMonth() - currentDateObj.getMonth() < 1){ return { "drugName": name, "daysToExpire": daysDifference,"daysSinceExpired":0};}
      else {
        if (expirationDateObj.getDate() - currentDateObj.getDate() < 7)  return { "drugName": name,"daysToExpire": daysDifference,"daysSinceExpired":0} 
        else if ((expirationDateObj - currentDateObj) < 3) { return {"drugName": name,"daysToExpire": daysToExpire,"daysSinceExpired":0};}
      }
    }
  }

  

module.exports = router;
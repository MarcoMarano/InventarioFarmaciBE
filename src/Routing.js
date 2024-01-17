/*IMPORT SECTION START */
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
/*IMPORT SECTION END */



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
    return client.db("DRUGS")
          .collection("DRUGS")
          .replaceOne(
            {_id: new ObjectId(drugId)},
            {
              _id:new ObjectId(drugId),
              drugName:newItem["drugName"],
              drugDescription:newItem["drugDescription"],
              drugInsertionDate:newItem["drugInsertionDate"],
              drugExpirationDate:newItem["drugExpirationDate"]
            });
}

async function  deleteDrugById(drugId){
  return await client.db("DRUGS").collection("DRUGS").deleteOne({_id: new ObjectId(drugId)});
}
/* ############## QUERY SECTION END ####################*/

/* ######################### ROUTING SECTION #############################*/

const router = express.Router();
// GET MAPPING
/** GET ALL DATA  **/
router.get('/drugs',  async function(request, response){
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

router.post('/drug', async function(request, response){
    const respFromDb = await insertDrug(request.body);
    response.send(respFromDb);
});

//PUT MAPPING
/** UPDATE DATA BY ID **/
router.put('/drug/:drugId', function(request, response){
    const respFromDb = updateDrugById(request.params.drugId,request.body);
    response.send(respFromDb);
});

//DELETE MAPPING
/** DELETE DATA by ID **/
router.delete('/drug/:drugId', function(request, response){
    console.log("Request recieved: ", request);
    const respFromDb = deleteDrugById(request.params.drugId);
    response.send(respFromDb);

});

router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

/* ######################### UTILITY METHODS SECTION #############################*/

function checkDates(expirationDate, currentDate, name) {
    const expirationDateObj = new Date(expirationDate);
    const currentDateObj = new Date(currentDate);
    const DIVIDER = (1000 * 60 * 60 * 24);
    const daysDifference = (expirationDateObj - currentDateObj) / DIVIDER

    if (expirationDateObj < currentDateObj){
      //e' gia' scaduto
      return { "drugName": name, "daysToExpire": 0, "daysSinceExpired":Math.abs(Math.round(daysDifference))};}
    else {
      //deve ancora scadere
      if (expirationDateObj.getMonth() - currentDateObj.getMonth() < 1){ return { "drugName": name, "daysToExpire": Math.round(daysDifference),"daysSinceExpired":0};}
      else {
        if (expirationDateObj.getDate() - currentDateObj.getDate() < 7)  return { "drugName": name,"daysToExpire": Math.round(daysDifference),"daysSinceExpired":0} 
        else if ((expirationDateObj - currentDateObj) < 3) { return {"drugName": name,"daysToExpire": Math.round(daysDifference),"daysSinceExpired":0};}
      }
    }
  }

  

module.exports = router;
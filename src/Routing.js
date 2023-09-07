/*IMPORT SECTION START */
const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
/*IMPORT SECTION END */
const uri = "mongodb+srv://admin:CTXP6a77pU58QlJA@inventariofarmacicluste.1k8lix8.mongodb.net/?retryWrites=true&w=majority"


/* ############## QUERY SECTION START ####################*/
const client = new MongoClient(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function retrieveAllDrugList(){ return await client.db("DRUGS").collection("DRUGS").find({}).toArray();}
async function retrieveDrugById(drugId) { return await client.db("DRUGS").collection("DRUGS").find({_id: drugId}).toArray(); }

async function  insertDrug(item){
    return await client.db("DRUGS").collection("DRUGS").insertOne(item);
}

async function  updateDrugById(drugId, newItem){
   try{
        return await Database.updateOne(drugId,newItem, (err, res) =>{
            if(err) throw err;
            res = "Document Successfully updated"
            console.log(res);
            return res;
        });
    }finally{client.close()}
}

async function  deleteDrugById(drugId){
    try{ return await Database.deleteOne(drugId);}
    finally{ closeDBConnection(); }
}
/* ############## QUERY SECTION END ####################*/



/* ######################### ROUTING SECTION #############################*/

const router = express.Router();
// GET MAPPING
/** GET ALL DATA  **/
router.get('/drugList',  async function(request, response){
    const drugList = await retrieveAllDrugList()
    console.log(drugList);
});

/** GET DATA BY ID **/
router.get(`/drugItemByID`, function(request, response){
  console.log(request.body);
    // const drugItem = retrieveDrugById(request.params())
    // response.send(drugItem);
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
router.delete('/deleteDrug/drug_id', function(request, response){
    console.log("Request recieved: ", request);
    const respFromDb = deleteDrugById(request.params(),request.body());
    response.send(respFromDb);
});

router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

module.exports = router;
const { MongoClient, ServerApiVersion } = require('mongodb');



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
function openDBConnection(){client.connect();}
function closeDBConnection(){client.close();}

//BISOGNA SISTEMARE LE QUERY DI RICERCA SEGUENDO L'ESEMPIO SU W3SCHOOL

 async function retrieveAllDrugList(){
    return await client.db("DRUGS")
                .collection("DRUGS")
                .find({})
                .toArray();
}

async function retrieveDrugById(drugId) {
    return await client.db("DRUGS")
                .collection("DRUGS")
                .find({_id: drugId})
                .toArray();
}

async function  insertDrug(item){
    return await client.db("DRUGS")
                .collection("DRUGS")
                .insertOne(item, (err, res)=>{
                    if(err) throw err;
                    res = "Document Successfully inserted"
                    console.log(res);
                    return res;
                });
}

async function  updateDrugById(drugId, newItem){
    return await client.db("DRUGS")
                .collection("DRUGS")
                .updateOne(drugId,newItem, (err, res) =>{
                    if(err) throw err;
                    res = "Document Successfully updated"
                    console.log(res);
                    return res;
                });
}

async function  deleteDrugById(drugId){
    return await client.db("DRUGS")
                .collection("DRUGS")
                .deleteOne(drugId);
}

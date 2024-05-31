import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config()

const uri = `${process.env.MONGO_URI}` || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const run = async () => {

    try {
        // Connect the client to the server
        await mongoose.connect(`${process.env.MONGO_URI}`)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch(err) {
        console.error(err);
    }
}

// run()
//
// let db = client.db("employees");

export default run;
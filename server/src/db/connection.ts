import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://users:Streamintel12@cluster0.bil7hgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "";
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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch(err) {
        console.error(err);
    } finally {
        await client.close()
    }
}

run()

let db = client.db("employees");

export default db;
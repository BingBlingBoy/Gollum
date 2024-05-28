import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app = express();
const port = 3000

app.use(cors({
    origin : [
        "https://localhost:5173"
    ]
}))

app.listen(port, () => {
    console.log(`Server goes on http://localhost:${port}`)
})

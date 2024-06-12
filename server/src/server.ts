import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import run from "./db/connection";
import bodyParser = require("body-parser");
import spotifyRoutes from "./controller/spotifyController"
import userRoutes from "./controller/userController"

run()
dotenv.config();


const app = express();
const port = process.env.PORT 

app.use(cors())
const jsonParser = bodyParser.json()
 
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET


const getRefreshToken = async (token: string) => {
    const url = "https://accounts.spotify.com/api/token";
    const bodyJSON = {
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: clientId
    }

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(bodyJSON)
    }
    try {
        const body = await fetch(url, payload);
        const response =  await body.json();
        return response
    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
}

app.post('/spotify/getrefreshtoken', jsonParser, async (req, res) => {
    try {
        const token = req.body.refreshToken
        const response = getRefreshToken(token)
    } catch (error) {
        throw new Error(`Couldn't get refresh token: ${error}`)
    }
})


app.use("/spotify", spotifyRoutes)
app.use("/user", userRoutes)


app.listen(port, () => {
    console.log(`Server goes on http://localhost:${port}`)
})

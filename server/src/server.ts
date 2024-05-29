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

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const getSpotifyAccessToken = async () => {

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: 'grant_type=client_credentials'
    })

    const data = await result.json()
    return data
}

app.get('/spotify', async (req, res) => {
    try {
        const token = await getSpotifyAccessToken();
        res.json({
            access_token: token.access_token,
            expires_in: token.expires_in
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve access token' });
    }
});

app.listen(port, () => {
    console.log(`Server goes on http://localhost:${port}`)
})

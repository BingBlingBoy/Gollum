import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app = express();
const port = process.env.PORT 

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

const getNewReleases = async (token: string) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json()
    return data
}

const search = async (token: string, type: string, query: string) => {
    console.log(token)
    const searchParameters = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    // const result = await fetch('https://api.spotify.com/v1/search?' +`type=${type}&` + `q=${query}` , searchParameters)

    try {
        const response = await fetch('https://api.spotify.com/v1/search?q=' + query + `&type=${type}`, searchParameters)
        if (!response.ok) {
            throw new Error("Couldn't fetch data")
        }
        const data = await response.json()
        return data
    } catch (error) {
        return error
    }
    // const result = await fetch(`https://api.spotify.com/v1/search?q=kendrick&type=album`, {
    //     method: 'GET',
    //     headers: {
    //         'content-type' : 'application/json', 
    //         'Authorization' : 'Bearer ' + token
    //     }
    // })

    // console.log(result)
    //
    // const data = await result.json()
    // return data
}

app.get('/spotify/getToken', async (req, res) => {
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

app.get('/spotify/newReleases', async (req, res) => {
    try {
        const token = await getSpotifyAccessToken()
        const newAlbumReleases = await getNewReleases(token.access_token);
        res.json({
            albums: newAlbumReleases.albums
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to get new Released albums'})
    }
})

app.get('/spotify/search/:type/:query', async (req, res) => {
    try {
        const type = req.params.type
        const query = req.params.query

        const token = await getSpotifyAccessToken()
        const searchResults = await search(token.access_token, type, query);
        res.json({
            type: searchResults
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to get new Released albums'})
    }
})
app.listen(port, () => {
    console.log(`Server goes on http://localhost:${port}`)
})

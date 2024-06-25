import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser";

dotenv.config()

const router = express.Router();

const jsonParser = bodyParser.json()
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

const getCurrentUsersProfile = async (token: string) => {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error("Couldn't get spotify account")
    }
}

const generateRandomString = (length: number) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const getUserRecentTracks = async (token: string) => {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error("Couldn't get spotify account")
    }
}

const search = async (token: string, type: string, query: string) => {
    try {
        const result = await fetch('https://api.spotify.com/v1/search?q=' + query + `&type=${type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!result.ok) {
            throw new Error("Couldn't fetch data")
        }
        const data = await result.json()
        return data
    } catch (error) {
        return error
    }
}

const searchNoType = async (token: string, query: string) => {
    try {
        const result = await fetch('https://api.spotify.com/v1/search?q=' + query + '&type=album%2Ctrack%2Cartist&limit=8', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!result.ok) {
            throw new Error("Couldn't fetch data")
        }
        const data = await result.json()
        return data
    } catch (error) {
        return error
    }
}

router.get('/getToken', async (req, res) => {
    try {
        const token = await getSpotifyAccessToken();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.json({
            access_token: token.access_token,
            expires_in: token.expires_in
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve access token' });
    }
});

router.get('/newReleases', async (req, res) => {
    try {
        const token = await getSpotifyAccessToken()
        const result = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token.access_token}
        });

        const data = await result.json()
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.json({
            albums: data.albums
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to get new Released albums'})
    }
})

router.get('/search/:query/:type', async (req, res) => {
    try {
        const type = req.params.type
        const query = req.params.query

        const token = await getSpotifyAccessToken()
        const searchResults = await search(token.access_token, type, query);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.json({
            type: searchResults
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to get new Released albums'})
    }
})

router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query

        const token = await getSpotifyAccessToken()
        const searchResultsNoType = await searchNoType(token.access_token, query);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.json({
            type: searchResultsNoType
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to get new Released albums'})
    }
})


router.post('/getUserProfile/', jsonParser, async (req, res) => {
    try {
        const token = req.body.accessToken
        const spotifyProfile = await getCurrentUsersProfile(token)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.json(spotifyProfile);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve access token ${error}`});
    }
});

router.post('/user/recenttracks', jsonParser, async (req, res) => {
    try {
        const token = req.body.spotify_user_token
        const recentTracks = await getUserRecentTracks(token)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.json(recentTracks);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve access token ${error}`});
    }
});

// const URL = 'https://gollum-kappa.vercel.app/'
const URL = 'http://localhost:5173/'

router.get('/login', (req, res) => {

    const scope = "streaming \
                 user-read-email \
                 user-read-private"
  
    const state = generateRandomString(16);

    if (!clientId) {
        throw new Error("client id not defined")
    }
  
    const auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: URL,
      state: state
    })
  
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})



export default router 
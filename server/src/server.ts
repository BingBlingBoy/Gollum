import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import run from "./db/connection";
import User from "./models/userModel";
import bodyParser = require("body-parser");

run()
dotenv.config();

const app = express();
const port = process.env.PORT 

app.use(cors())
const jsonParser = bodyParser.json()
 
const urlencodedParser = bodyParser.urlencoded({ extended: false })
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

const generateRandomString = (length: number) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

const registerUser = async (name: string, email: string) => {
    
    const userExists = await User.findOne({email}) 

    if (userExists) {
        return {
            success: false,
            reason: "user exists"
        }
    }

    const user = await User.create({
        name,
        email,
        likedAlbums: {},
        likedArtists: {},
        likedTracks: {}
    });

    const success = {
        success: true 
    }

    if (user) {
        return success
    } else {
        throw new Error('Invalid user data')
    }
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

// const getSpotifyAccount = async (userEmail: string) => {
//     try {
//         const user = await User.find({email: userEmail})
//         console.log(user)
//         return user[0] 
//     } catch (error) {
//         console.log(error)
//     }
// } 

app.post('/spotify/user/recenttracks', jsonParser, async (req, res) => {
    try {
        const token = req.body.spotify_user_token
        console.log(token)
        const recentTracks = await getUserRecentTracks(token)
        console.log(recentTracks)
        res.json(recentTracks);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve access token ${error}`});
    }
});

app.post('/spotify/getUserToken/', jsonParser, async (req, res) => {
    try {
        const token = req.body.accessToken
        const spotifyProfile = await getCurrentUsersProfile(token)
        res.json(spotifyProfile);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve access token ${error}`});
    }
});

// app.get('/spotify/profile/:email', async (req, res) => {
//     try {
//         const userEmail = req.params.email
//         const data =  await getSpotifyAccount(userEmail)    
//         console.log(data)
//         res.json({
//             spotifyUserAccount: data?.spotifyAccount
//         })
//     } catch (error) {
//         throw new Error("Couldn't get spotify account")
//     }    
// })

app.post('/users/register', jsonParser, async (req, res) => {
    try {
        const {name, email} = req.body
        await registerUser(name, email)
    } catch (error) {
        throw new Error("Could not register new user")
    }
})


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

app.get('/spotify/search/:query/:type', async (req, res) => {
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

app.get('/spotify/search/:query', async (req, res) => {
    try {
        const query = req.params.query

        const token = await getSpotifyAccessToken()
        const searchResultsNoType = await searchNoType(token.access_token, query);
        res.json({
            type: searchResultsNoType
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to get new Released albums'})
    }
})

app.get('/spotify/login', (req, res) => {

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
      redirect_uri: "http://localhost:5173/profile",
      state: state
    })
  
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  })


app.listen(port, () => {
    console.log(`Server goes on http://localhost:${port}`)
})

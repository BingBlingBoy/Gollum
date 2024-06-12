import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import run from "./db/connection";
import User from "./models/userModel";
import bodyParser = require("body-parser");
import spotifyRoutes from "./controller/spotifyController"

run()
dotenv.config();


const app = express();
const port = process.env.PORT 

app.use(cors())
const jsonParser = bodyParser.json()
 
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

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

interface Album {
    albumName: string;
    albumImage: string;
}

interface Artist {
    artistName: string
    artistImage: string
}

interface RatedArtist {
    [artistId: string]: Artist
}

interface RatedAlbums {
    [albumId: string] : Album
}

interface Image {
    url: string
}

const addRatedAlbums = async (name: string, image: Image, id: string, userEmail: string, type: string) => {
    
    const user = await User.findOne({email: userEmail})

    const likedAlbums = user?.ratedAlbums.likedAlbums || {}
    const dislikedAlbums = user?.ratedAlbums.dislikedAlbums || {};

    let updateQuery: RatedAlbums =  {}
    const albumId = id 
    const albumName = name
    const albumImage = image.url
    const newAlbum = {
        albumName,
        albumImage
    }
        
    if (type === 'liked' && (albumId in dislikedAlbums)) {
        const removeFromDisliked = {
            $unset: { [`ratedAlbums.dislikedAlbums.${albumId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromDisliked);
    
        updateQuery[`ratedAlbums.likedAlbums.${albumId}`] = newAlbum;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'liked' && (albumId in likedAlbums)) {
        const removeFromLiked = {
            $unset: { [`ratedAlbums.likedAlbums.${albumId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromLiked);
    } 
    else if (type === 'disliked' && (albumId in dislikedAlbums)) {
        const removeFromDisliked = {
            $unset: { [`ratedAlbums.dislikedAlbums.${albumId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromDisliked);
    } 
    else if (type === 'disliked' && (albumId in likedAlbums)) {
        const removeFromLiked = {
            $unset: { [`ratedAlbums.likedAlbums.${albumId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromLiked);
    
        updateQuery[`ratedAlbums.dislikedAlbums.${albumId}`] = newAlbum;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'liked' && !(albumId in dislikedAlbums)) {
        updateQuery[`ratedAlbums.likedAlbums.${albumId}`] = newAlbum;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'disliked' && !(albumId in likedAlbums)) {
        updateQuery[`ratedAlbums.dislikedAlbums.${albumId}`] = newAlbum;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
}


const addRatedArtists = async (name: string, image: Image, id: string, userEmail: string, type: string) => {
    const user = await User.findOne({email: userEmail})

    const likedArtists = user?.ratedArtists.likedArtists || {}
    const dislikedAlbums = user?.ratedArtists.dislikedArtists || {};

    const updateQuery: RatedArtist =  {}
    const artistId = id 
    const artistName = name
    const artistImage = image.url
    const newArtist = {
        artistName,
        artistImage
    }

    if (type === 'liked' && (artistId in dislikedAlbums)) {
        const removeFromDisliked = {
            $unset: { [`ratedArtists.dislikedArtists.${artistId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromDisliked);
    
        updateQuery[`ratedArtists.likedArtists.${artistId}`] = newArtist;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'liked' && (artistId in likedArtists)) {
        const removeFromLiked = {
            $unset: { [`ratedArtists.likedArtists.${artistId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromLiked);
    }
    else if (type === 'disliked' && (artistId in dislikedAlbums)) {
        const removeFromDisliked = {
            $unset: { [`ratedArtists.dislikedArtists.${artistId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromDisliked);
    } 
    else if (type === 'disliked' && (artistId in likedArtists)) {
        const removeFromLiked = {
            $unset: { [`ratedArtists.likedArtists.${artistId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromLiked);
    
        updateQuery[`ratedArtists.dislikedArtists.${artistId}`] = newArtist;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'liked') {
        updateQuery[`ratedArtists.likedArtists.${artistId}`] = newArtist;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'disliked') {
        updateQuery[`ratedArtists.dislikedArtists.${artistId}`] = newArtist;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
}

const getRatedAlbums = async (userEmail: string) => {
    try {
        const user = await User.findOne({email: userEmail})
    
        if (user) {
            const usersLikedAlbums = {
                ratedAlbums: user.ratedAlbums,
            };

            return usersLikedAlbums
            
        }
    } catch (error) {
        throw new Error(`Couldn't get albums: ${error}`)
    }
}

const getRatedArtist = async (userEmail: string) => {
    try {
        const user = await User.findOne({email: userEmail})

        if (user) {
            const usersDislikedAlbums = {
                ratedArtist: user.ratedArtists
            }

            return usersDislikedAlbums
        }
    } catch (error) {
        throw new Error(`Couldn't get artist: ${error}`)
    }
}

app.post('/user/add/ratedalbum', jsonParser, async (req, res) => {
    try {
        const {name, image, id, userEmail, type} = req.body
        addRatedAlbums(name, image, id, userEmail, type)
        res.status(200).json({
            success: true
        })
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})

app.post('/user/get/ratedalbum', jsonParser, async (req, res) => {
    try {
        const {userEmail} = req.body
        const response = await getRatedAlbums(userEmail)
        res.json(response)
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})

app.post('/user/get/ratedartist', jsonParser, async (req, res) => {
    try {
        const {userEmail} = req.body
        const response = await getRatedArtist(userEmail)
        res.json(response)
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})

app.post('/user/add/ratedartist', jsonParser, async (req, res) => {
    try {
        const {name, image, id, userEmail, type} = req.body
        addRatedArtists(name, image, id, userEmail, type)
        res.status(200).json({
            success: true
        })
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})


app.post('/spotify/getrefreshtoken', jsonParser, async (req, res) => {
    try {
        const token = req.body.refreshToken
        const response = getRefreshToken(token)
    } catch (error) {
        throw new Error(`Couldn't get refresh token: ${error}`)
    }
})


app.post('/users/register', jsonParser, async (req, res) => {
    try {
        const {name, email} = req.body
        await registerUser(name, email)
    } catch (error) {
        throw new Error(`Could not register new user: ${error}`)
    }
})

app.use("/spotify", spotifyRoutes)


app.listen(port, () => {
    console.log(`Server goes on http://localhost:${port}`)
})

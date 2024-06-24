import bodyParser from "body-parser"
import express from "express"
import User from "../models/userModel"
import { RatedAlbums, RatedArtist, Image, RatedTracks} from "../models/userTypes"


const jsonParser = bodyParser.json()
const router = express.Router()

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

    const onlyOneUser = await User.findOne({email})
    if (onlyOneUser) {
        return success
    } else {
        throw new Error('Invalid user data')
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

const getRatedTrack = async (userEmail: string) => {
    try {
        const user = await User.findOne({email: userEmail})

        if (user) {
            const usersDislikedAlbums = {
                ratedTrack: user.ratedTracks
            }

            return usersDislikedAlbums
        }
    } catch (error) {
        throw new Error(`Couldn't get artist: ${error}`)
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


const addRatedTracks = async (name: string, image: Image, artist: string, id: string, userEmail: string, type: string) => {
    const user = await User.findOne({email: userEmail})

    const likedTracks = user?.ratedTracks.likedTracks || {}
    const dislikedTracks = user?.ratedTracks.dislikedTracks || {};

    const updateQuery: RatedTracks =  {}
    const trackId = id 
    const trackName = name
    const imageURL = image.url
    const artistName = artist
    const newTrack = {
        trackName,
        imageURL,
        artistName
    }

    if (type === 'liked' && (trackId in dislikedTracks)) {
        const removeFromDisliked = {
            $unset: { [`ratedTracks.dislikedTracks.${trackId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromDisliked);
    
        updateQuery[`ratedTracks.likedTracks.${trackId}`] = newTrack;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'liked' && (trackId in likedTracks)) {
        const removeFromLiked = {
            $unset: { [`ratedTracks.likedTracks.${trackId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromLiked);
    }
    else if (type === 'disliked' && (trackId in dislikedTracks)) {
        const removeFromDisliked = {
            $unset: { [`ratedTracks.dislikedTracks.${trackId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromDisliked);
    } 
    else if (type === 'disliked' && (trackId in likedTracks)) {
        const removeFromLiked = {
            $unset: { [`ratedTracks.likedTracks.${trackId}`]: 1 }
        };
        await User.findOneAndUpdate({ email: userEmail }, removeFromLiked);
    
        updateQuery[`ratedTracks.dislikedTracks.${trackId}`] = newTrack;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'liked') {
        updateQuery[`ratedTracks.likedTracks.${trackId}`] = newTrack;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
    else if (type === 'disliked') {
        updateQuery[`ratedTracks.dislikedTracks.${trackId}`] = newTrack;
        await User.findOneAndUpdate({email: userEmail}, updateQuery, {new: true})
    }
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
router.post('/register', jsonParser, async (req, res) => {
    try {
        const {name, email} = req.body
        const response = await registerUser(name, email)
        res.header("Access-Control-Allow-Origin", "*");
        res.json(response)
    } catch (error) {
        throw new Error(`Could not register new user: ${error}`)
    }
})


router.post('/get/ratedalbum', jsonParser, async (req, res) => {
    try {
        const {userEmail} = req.body
        const response = await getRatedAlbums(userEmail)
        res.header("Access-Control-Allow-Origin", "*");
        res.json(response)
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})

router.post('/get/ratedartist', jsonParser, async (req, res) => {
    try {
        const {userEmail} = req.body
        const response = await getRatedArtist(userEmail)
        res.header("Access-Control-Allow-Origin", "*");
        res.json(response)
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})

router.post('/add/ratedartist', jsonParser, async (req, res) => {
    try {
        const {name, image, id, userEmail, type} = req.body
        addRatedArtists(name, image, id, userEmail, type)
        res.header("Access-Control-Allow-Origin", "*");
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


router.post('/add/ratedtrack', jsonParser, async (req, res) => {
    try {
        const {name, image, artist, id, userEmail, type} = req.body
        addRatedTracks(name, image, artist, id, userEmail, type)
        res.header("Access-Control-Allow-Origin", "*");
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

router.post('/get/ratedtrack', jsonParser, async (req, res) => {
    try {
        const {userEmail} = req.body
        const response = await getRatedTrack(userEmail)
        res.header("Access-Control-Allow-Origin", "*");
        res.json(response)
    } catch (error) {
        res.status(403).json({
            success: false 
        })
        throw new Error(`Couldn't add albums: ${error}`)
    }
})

router.post('/add/ratedalbum', jsonParser, async (req, res) => {
    try {
        const {name, image, id, userEmail, type} = req.body
        addRatedAlbums(name, image, id, userEmail, type)
        res.header("Access-Control-Allow-Origin", "*");
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

export default router
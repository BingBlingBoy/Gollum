import mongoose, { Schema, model, connect } from "mongoose";

interface IUser {
    name: string
    email: string
    password: string
    likedAlbums: LikedAlbums
    likedTracks: LikedTracks
    likedArtist: LikedArtist
}

interface LikedAlbums {
    albumName: string
    imageURL: string
    artistName: string
}

interface LikedTracks {
    trackName: string
    imageURL: string
    artistName: string
}

interface LikedArtist {
    artistName: string
    imageURL: string
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    likedAlbums: {
        type: Object,
        default: {}
    },
    likedArtist: {
        type: String,
        default: {}
    },
    likedTracks: {
        type: String,
        default: {}
    },

})
const User = mongoose.model<IUser>('User', userSchema)

export default User

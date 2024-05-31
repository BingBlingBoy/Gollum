import mongoose, { Schema, model, connect } from "mongoose";

interface IUser {
    name: string
    email: string
    likedAlbums: LikedAlbums
    likedTracks: LikedTracks
    likedArtists: LikedArtists
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

interface LikedArtists {
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
    likedAlbums: {
        type: Object,
        default: {}
    },
    likedArtists: {
        type: Object,
        default: {}
    },
    likedTracks: {
        type: Object,
        default: {}
    },

})
const User = mongoose.model<IUser>('User', userSchema)

export default User

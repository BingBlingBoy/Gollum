import mongoose, { Schema, model, connect } from "mongoose";

interface IUser {
    name: string
    email: string
    spotifyAccount: string
    ratedAlbums: {
        likedAlbums: Albums,
        dislikedAlbums: Albums
    }
    likedTracks: LikedTracks
    likedArtists: LikedArtists
    dislikedArtists: LikedArtists
}

interface Albums {
    [albumId: string] : {
        albumName: string
        albumImage: string
    }
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
    spotifyAccount: {
        type: String,
        unique: true,
    },
    ratedAlbums: {
        type: Object,
        default: {}
    },
    likedArtists: {
        type: Object,
        default: {}
    },
    dislikedArtists: {
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

import mongoose, { Schema, model, connect } from "mongoose";

interface IUser {
    name: string
    email: string
    spotifyAccount: string
    ratedAlbums: {
        likedAlbums: Albums,
        dislikedAlbums: Albums
    }
    ratedArtists: {
        likedArtists: Artists,
        dislikedArtists: Artists
    }
    likedTracks: LikedTracks
}

interface Albums {
    [albumId: string] : {
        albumName: string
        albumImage: string
    }
}

interface Artists {
    [artistId: string] : {
        artistName: string
        imageURL: string
    }
}

interface LikedTracks {
    trackName: string
    imageURL: string
    artistName: string
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
    ratedArtists: {
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

// const URL = 'https://gollum-0q6i.onrender.com'
const URL = 'http://localhost:3000'


export const retrieveNewAlbumReleases = async () => {
    try {
        const response = await fetch(`${URL}/spotify/newReleases`)
        const data = await response.json()
        return data.albums.items
    } catch (error) {
        return error
    }
}

export const getUserRecentTracks = async () => {
    try {
        const aT = localStorage.getItem("accessToken")
        const response = await fetch(`${URL}/spotify/user/recenttracks`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                spotify_user_token: aT
            })
        })
        const data = await response.json()
        return data    
    } catch (error) {
        throw new Error(`Couldn't get users recent tracks: ${error}`)    
    }    
} 

export const linkSpotifyAccount = async () => {
    try {
        const aT = localStorage.getItem("accessToken")
        const spotifyAccount = await fetch(`https://gollum-0q6i.onrender.com/spotify/getUserProfile/`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify({
                accessToken: aT
            })
        })

        const data = await spotifyAccount.json()
        return data    
    } catch (error) {
        throw new Error("Couldn't get spotify account")
    }
}
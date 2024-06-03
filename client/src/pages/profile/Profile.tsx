import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../../components/Navbar"
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface SpotifyToken {
    display_name: string,
    images: Image[]
}

interface Artists {
    name: string
    images: Image[]
    external_urls: ExternalURLs
}

interface Track {
    track: TracksFromSearch;
}

interface TracksFromSearch {
    album: Artists
    artists: ArtistFromAlbum[] 
    external_urls: ExternalURLs
    name: string
}

interface ArtistFromAlbum {
    name: string
    external_urls: ExternalURLs
}

interface Image {
    url: string
}

interface ExternalURLs {
    spotify: string
}

const Profile = () => {

    const { user } = useAuth0()

    const getUserRecentTracks = async () => {
        try {
            const aT = localStorage.getItem("accessToken")
            const response = await fetch(`http://localhost:3000/spotify/user/recenttracks`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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


    const linkSpotifyAccount = async () => {
        try {
            const aT = localStorage.getItem("accessToken")
            const spotifyAccount = await fetch(`http://localhost:3000/spotify/getUserProfile/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: aT
                })
            })

            const data = await spotifyAccount.json()
            console.log("linkSpotifyAccount: ", data)
            return data    
        } catch (error) {
            throw new Error("Couldn't get spotify account")
        }
    }

    const {data: userRecentlyListenedTracks} = useQuery({
        queryKey: ["recentlyListenedTracks"],
        queryFn: getUserRecentTracks 
    })

    const {data: spotifyProfileAccount, isFetching} = useQuery<SpotifyToken>({
        queryKey: ["spotifyProfile"],
        queryFn: linkSpotifyAccount
    })

    useEffect(() => {
        console.log(userRecentlyListenedTracks)
    },[])

    const content = (
        <>
            <Navbar />
            <>
                <div className="flex items-center justify-center">
                    <div className="grid grid-cols-2 w-full">
                        {
                            !isFetching &&
                                <>
                                    <div className="text-white grid col-span-2 m-20 bg-primary rounded-md grid grid-cols-2 p-10 gap-x-16">
                                        <div className="flex gap-x-10">
                                            <div>
                                                <img className="w-36 h-36 rounded-full outline outline-black" src={spotifyProfileAccount?.images[1].url} alt="" />
                                            </div>
                                            <div className="">
                                                <h1 className="pb-2 font-bold text-3xl">{user?.name}</h1>
                                                <p>Spotify Name: {spotifyProfileAccount?.display_name}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p>Lorem ipsum, psam neque totam qui recusandae quos voluptas fugiat voluptatum!</p>
                                        </div>  
                                    </div>

                                    <div className="ml-20">
                                        <h1 className="font-bond text-black text-3xl font-bold mb-4">Recent Tracks</h1>
                                        <div className="flex flex-col bg-best-gray w-99">
                                            {userRecentlyListenedTracks.items.map((data: Track, i: number) => (
                                                <div className="flex justify-between my-2 items-center" key={i}>
                                                    <div className="flex flex-row gap-x-2 items-center">
                                                        <img className="w-10 h-10" src={data.track.album.images[2].url} alt="album image" />
                                                        <h1>{data.track.name}</h1>
                                                    </div>
                                                    <p className="pr-4">{data.track.artists[0].name}</p>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </>

        </>
    )

    return content
}

export default Profile
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../../components/Navbar"
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface SpotifyToken {
    display_name: string,
    images: Images[]
}

interface Images {
    url: string
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

    const {data: spotifyProfileAccount, isFetching} = useQuery({
        queryKey: ["spotifyProfile"],
        queryFn: linkSpotifyAccount
    })

    const content = (
        <>
            <Navbar />
            <>
                <div className="mt-24 flex items-center justify-center flex-col">
                    {
                        !isFetching &&
                        <>
                            <div className="text-white bg-primary rounded-md flex justify-between p-10 gap-x-16 max-w-7xl">
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

                            <div className="bg-best-gray">
                                <div>
                                    <h1 className="font-bond text-black">Recent Tracks</h1>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </>

        </>
    )

    return content
}

export default Profile
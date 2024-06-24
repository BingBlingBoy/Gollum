import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../../components/Navbar"
import { useQuery } from "@tanstack/react-query";
import Footer from "../../components/Footer";

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
            const response = await fetch(`https://gollum-0q6i.onrender.com/spotify/user/recenttracks`, {
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


    const linkSpotifyAccount = async () => {
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
    
    const gettingLikedAlbums = async () => {
        try {
            const response = await fetch('https://gollum-0q6i.onrender.com/user/get/ratedalbum', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    userEmail: user?.email,
                })
                
            })
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error(`Couldn't get liked albums: ${error}`)
        }
    }

    const gettingLikedArtists = async () => {
        try {
            const response = await fetch('https://gollum-0q6i.onrender.com/user/get/ratedartist', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    userEmail: user?.email,
                })
                
            })
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error(`Couldn't get liked albums: ${error}`)
        }
    }

    const gettingLikedTracks = async () => {
        try {
            const response = await fetch('https://gollum-0q6i.onrender.com/user/get/ratedtrack', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    userEmail: user?.email,
                })
                
            })
            const data = await response.json()
            console.log(data)
            return data
        } catch (error) {
            throw new Error(`Couldn't get liked albums: ${error}`)
        }

    }

    const {data: userRecentlyListenedTracks, isLoading: loadingRecentlyListenedTracks} = useQuery({
        queryKey: ["recentlyListenedTracks"],
        queryFn: getUserRecentTracks 
    })

    const {data: userRatedAlbums, isLoading: loadingRatedAlbums} = useQuery({
        queryKey: ['GettingLikedAlbums'],
        queryFn: gettingLikedAlbums
    })

    const {data: userRatedArtists, isLoading: loadingRatedArtists } = useQuery({
        queryKey: ['GettingLikedArtists'],
        queryFn: gettingLikedArtists
    })

    const {data: userRatedTracks, isLoading: loadingRatedTracks } = useQuery({
        queryKey: ['GettingLikedTracks'],
        queryFn: gettingLikedTracks
    })

    const {data: spotifyProfileAccount, isLoading: loadingSpotifyProfileAccount } = useQuery<SpotifyToken>({
        queryKey: ["spotifyProfile"],
        queryFn: linkSpotifyAccount
    })

    const content = (
        <>
            <Navbar />
            <>
                <div className="flex items-center justify-center">
                    <div className="grid grid-cols-2 w-full">
                        {
                            !loadingSpotifyProfileAccount &&
                                <>
                                    <div className="text-white col-span-2 m-20 bg-primary rounded-md grid grid-cols-2 p-10 gap-x-16">
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
                                </>
                        }

                        <div className="mx-20">
                            <h1 className="font-bond text-black text-3xl mb-4">Recent Tracks</h1>
                            <div className="flex flex-col bg-best-gray w-99">
                                {
                                    !loadingRecentlyListenedTracks &&
                                    <>
                                        {userRecentlyListenedTracks.items.map((data: Track, i: number) => (
                                            <div className="flex justify-between my-2 items-center" key={i}>
                                                <div className="flex flex-row gap-x-2 items-center">
                                                    <img className="w-10 h-10" src={data.track.album.images[2].url} alt="album image" />
                                                    <h1>{data.track.name}</h1>
                                                </div>
                                                <p className="pr-4">{data.track.artists[0].name}</p>

                                            </div>
                                        ))}
                                    </>    
                                }
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-10 mx-20">
                            <div>
                                <h1 className="font-bond text-black text-3xl mb-4">Liked Albums</h1>
                                    {
                                        !loadingRatedAlbums && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            Object.values(userRatedAlbums?.ratedAlbums?.likedAlbums || {}).filter((album: any) => album.albumName !== "test").slice(0,6).map((data: any, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <img className="w-24 h-24" src={data.albumImage} alt="album image" />
                                                    <p className="font-semibold text-xs">{data.albumName}</p>
                                                </div>
                                            ))}
                                        </div>
                                        )
                                    }
                                <div className="flex justify-end">
                                    <button className="text-accent font-semibold pr-1" type="submit">More</button>
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bond text-black text-3xl mb-4">Liked Artists</h1>
                                {
                                    !loadingRatedArtists && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                Object.values(userRatedArtists?.ratedArtist?.likedArtists || {}).filter((artist: any) => artist.artistName !== "test").slice(0,6).map((data: any, i) => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <img className="w-24 h-24" src={data.artistImage} alt="album image" />
                                                        <p className="font-semibold text-xs">{data.artistName}</p>
                                                    </div>
                                                ))}
                                        </div>
                                    )
                                }
                                <div className="flex justify-end">
                                    <button className="text-accent font-semibold pr-1" type="submit">More</button>
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bond text-black text-3xl mb-4">Liked Tracks</h1>
                                {
                                    !loadingRatedTracks && (
                                        <div className="grid grid-cols-3 gap-4">
                                            {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                Object.values(userRatedTracks?.ratedTrack?.likedTracks || {}).filter((track: any) => track.trackName !== "test").slice(0,6).map((data: any, i) => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <img className="w-24 h-24" src={data.imageURL} alt="album image" />
                                                        <div className="flex flex-col">
                                                            <p className="font-semibold text-sm">{data.trackName}</p>
                                                            <p className="text-xs">{data.artistName}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )
                                }
                                <div className="flex justify-end">
                                    <button className="text-accent font-semibold pr-1" type="submit">More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            <Footer />
        </>
    )

    return content
}

export default Profile
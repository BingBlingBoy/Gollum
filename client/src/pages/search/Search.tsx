import { useLocation } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import profile_page from "../../assets/profile_page.svg"
import LikeAndDislike from "../../components/LikeAndDislike"
import { useAuth0 } from "@auth0/auth0-react"
import { Artists, Albums } from "../../models/spotifyTypes"
import Footer from "../../components/Footer"
// import Playbutton from "../../components/Playbutton"

const Search = () => {
    // const URL = 'https://gollum-0q6i.onrender.com'
    const URL = 'http://localhost:3000'

    const [selectedCategory, setSelectedCategory] = useState("Everything")

    interface BaseItem {
        name: string;
        id: string;
        images: Image[];
        external_urls: ExternalURLs;
        href: string;
    }
    interface Tracks extends BaseItem {
        album: Albums;
        artists: Artists[];
    }

    interface Image {
        url: string;
    }

    // interface Tracks {
    //     album: Artists
    //     artists: Artists
    //     external_urls: ExternalURLs
    //     name: string
    // }

    interface ExternalURLs {
        spotify: string
    }

    const { state } = useLocation()

    const { isAuthenticated } = useAuth0()

    const retrieveDefaultSearchResult = async () => {
        setSelectedCategory("Everything")
        try {
            const result = await fetch(`${URL}/spotify/search/${state.query}`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const retrieveAlbumSearchResult = async () => {
        setSelectedCategory("Album")
        try {
            const result = await fetch(`${URL}/spotify/search/${state.query}/album`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const retrieveTrackSearchResult = async () => {
        setSelectedCategory("Track")
        try {
            const result = await fetch(`${URL}/spotify/search/${state.query}/track`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const retrieveArtistSearchResult = async () => {
        setSelectedCategory("Artist")
        try {
            const result = await fetch(`${URL}/spotify/search/${state.query}/artist`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    // const retrieveSpotifyToken = async () => {
    //     try {
    //         const response = await fetch("http://localhost:3000/spotify/getToken")
    //         const data = await response.json()
    //         return data
    //     } catch (error) {
    //         throw new Error(`Couldn't get token: ${error}`)
    //     }
    // }

    const {data: searchArtistResults, isLoading: loadingArtists, refetch: artistRefetch} = useQuery({
        queryKey: ['aristSearchResults'],
        queryFn: retrieveArtistSearchResult,
    })

    const {data: searchTrackResults, isLoading: loadingTracks, refetch: trackRefetch} = useQuery({
        queryKey: ['trackSearchResults'],
        queryFn: retrieveTrackSearchResult,
    })

    const {data: searchAlbumResults, isLoading: loadingAlbums, refetch: albumRefetch} = useQuery({
        queryKey: ['albumSearchResults'],
        queryFn: retrieveAlbumSearchResult,
    })

    const {data: searchResults, isLoading: loadingEverything, refetch: defaultRefetch} = useQuery({
        queryKey: ['defaultSearchResults'],
        queryFn: retrieveDefaultSearchResult,
    })

    // const {data: spotifyToken, isFetched} = useQuery({
    //     queryKey: ['gettingSpotifyToken'],
    //     queryFn: retrieveSpotifyToken
    // })

    useEffect(() => {
        if (selectedCategory == "Everything") {
            defaultRefetch()
        }
        if (selectedCategory == "Album") {
            albumRefetch()
        }
        if (selectedCategory == "Track") {
            trackRefetch()
        }
        if (selectedCategory == "Artist") {
            artistRefetch()
        }

        state.query

    },[albumRefetch, artistRefetch, defaultRefetch, selectedCategory, state.query, trackRefetch])

    const content = (
        <>
            <Navbar />
            <div className="mx-64 p-10">
                <div>
                    <p className="text-2xl font-bold">Search Results for "{state.query}"</p>
                    <ul className="flex gap-12 pt-4">
                        <button onClick={retrieveDefaultSearchResult} className={`p-2 ${selectedCategory === "Everything" ? "border-b-2 border-accent" : ""}`}>Everything</button>
                        <button onClick={retrieveArtistSearchResult} className={`p-2 ${selectedCategory === "Artist" ? "border-b-2 border-accent" : ""}`}>Artist</button>
                        <button onClick={retrieveAlbumSearchResult} className={`p-2 ${selectedCategory === "Album" ? "border-b-2 border-accent" : ""}`}>Album</button>
                        <button onClick={retrieveTrackSearchResult} className={`p-2 ${selectedCategory === "Track" ? "border-b-2 border-accent" : ""}`}>Track</button>
                    </ul>
                </div>
                {
                    (selectedCategory == "Everything" && !loadingEverything) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Artists</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-2 lg:grid-cols-4">
                                            {searchResults.type.artists.items.map((data:Artists, i: number) => (
                                                <>
                                                    <div className="flex flex-col">
                                                        <div className="relative max-w-[236px] max-h-[236px] bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                            <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                            <ol className="absolute bottom-2 left-2"><a className="text-lg font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                        </div>
                                                        { isAuthenticated &&
                                                            <LikeAndDislike data={data} type={"artist"}/>
                                                        }
                                                    </div>
                                                </>
                                            ))}    
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => {setSelectedCategory("Artist")}} className="text-accent font-semibold pr-1" type="submit">More</button>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="mt-16">
                                <h1 className="text-3xl mb-2">Albums</h1>
                                <div>
                                    {
                                        <>
                                            <div className="grid grid-cols-2 lg:grid-cols-4">
                                                {searchResults.type.albums.items.map((data:Albums, i: number) => (
                                                    <>
                                                        <div className="flex flex-col">
                                                            <div className="relative max-w-[236px] max-h-[236px] bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                                <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                                <ol className="absolute bottom-2 left-2"><a className="text-xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                            </div>
                                                            { isAuthenticated &&
                                                                <LikeAndDislike data={data} type={"album"}/>
                                                            }
                                                        </div>
                                                    </>
                                                ))}    
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={() => {setSelectedCategory("Album")}} className="text-accent font-semibold pr-1" type="submit">More</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="mt-16">
                                <h1 className="text-3xl mb-2">Tracks</h1>
                                <div>
                                    {
                                        <>
                                            <div className="grid grid-cols-2 lg:grid-cols-4">
                                                {searchResults.type.tracks.items.map((data:Tracks, i: number) => (
                                                    <>
                                                        <div className="flex flex-col">
                                                            <div className="relative max-w-[236px] max-h-[236px] bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                                <img className="w-full h-full" src={data.album.images.length !== 0 ? data.album.images[0].url : profile_page} alt="Artist Picture"/>
                                                                <ol className="absolute bottom-2 left-2"><a className="text-xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                            </div>
                                                            {
                                                                isAuthenticated && 
                                                                    <LikeAndDislike data={data} type={"track"} />
                                                            }
                                                        </div>
                                                    </>
                                                ))}    
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={() => {setSelectedCategory("Track")}} className="text-accent font-semibold pr-1" type="submit">More</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                }
                {
                    (selectedCategory == "Album" && !loadingAlbums) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Albums</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
                                            {searchAlbumResults.type.albums.items.map((data:Albums, i: number) => (
                                                <div className="flex flex-row gap-2 py-4 items-center justify-between">
                                                    <div className="flex flex-row items-center">
                                                        <div className="max-w-20 max-h-20 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                            <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                        </div>
                                                        <div className="pl-4 max-w-56">
                                                            <ol><a className="text-md font-bold text-black" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                            <p className="text-black text-sm"><a href={data.artists[0].external_urls.spotify}>{data.artists[0].name}</a></p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white w-28">
                                                        { isAuthenticated &&
                                                            <LikeAndDislike data={data} type={"album"}/>
                                                        }
                                                    </div>
                                                </div>
                                            ))}    
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                }
                {
                    (selectedCategory == "Track" && !loadingTracks) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Tracks</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
                                            {searchTrackResults.type.tracks.items.map((data:Tracks, i: number) => (
                                                <div className="flex flex-row gap-2 py-4 items-center justify-between">
                                                    <div className="flex flex-row items-center">
                                                        <div className="max-w-20 max-h-20 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                            <img className="w-full h-full" src={data.album.images.length !== 0 ? data.album.images[0].url : profile_page} alt="Artist Picture"/>
                                                        </div>
                                                        <div className="pl-4 max-w-56">
                                                            <ol><a className="text-md font-bold text-black" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                            <p className="text-black text-sm"><a href={data.artists[0].external_urls.spotify}>{data.artists[0].name}</a></p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white w-28">
                                                        { isAuthenticated &&
                                                            <LikeAndDislike data={data} type={"track"}/>
                                                        }
                                                    </div>
                                                </div>
                                            ))}    
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                }
                {
                    (selectedCategory == "Artist" && !loadingArtists) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Artists</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
                                            {searchArtistResults.type.artists.items.map((data:Artists, i: number) => (
                                                <>
                                                    <div className="flex flex-row gap-4 py-4 items-center justify-between">
                                                        <div className="flex flex-row items-center">
                                                            <div className="max-w-20 max-h-20 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                                <img className="w-[80px] h-[80px]" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                            </div>
                                                            <div className="pl-4 max-w-56">
                                                                <ol><a className="text-md font-bold text-black" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                                <p className="text-black text-sm"><a href={data.external_urls.spotify}>{data.name}</a></p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white w-28">
                                                            { isAuthenticated &&
                                                                <LikeAndDislike data={data} type={"artists"}/>
                                                            }
                                                        </div>
                                                    </div>
                                                </>
                                            ))}    
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                }
            </div>
            <Footer />
        </>
    )

    return content
}

export default Search
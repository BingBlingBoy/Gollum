import { useLocation } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import profile_page from "../../assets/profile_page.svg"

const Search = () => {

    const [selectedCategory, setSelectedCategory] = useState("Everything")

    interface Artists {
        name: string
        images: Image[]
        external_urls: ExternalURLs
    }

    interface Albums {
        name: string
        images: Image[]
        external_urls: ExternalURLs
        artists: ArtistFromAlbum[]
    }

    interface ArtistFromAlbum {
        name: string
        external_urls: ExternalURLs
    }

    interface Tracks {
        album: Artists
        artists: Artists
        external_urls: ExternalURLs
        name: string
    }

    interface TracksFromSearch {
        album: Artists
        artists: ArtistFromAlbum[] 
        external_urls: ExternalURLs
        name: string
    }

    interface Image {
        url: string
    }

    interface ExternalURLs {
        spotify: string
    }

    const { state } = useLocation()

    const retrieveDefaultSearchResult = async () => {
        setSelectedCategory("Everything")
        try {
            const result = await fetch(`http://localhost:3000/spotify/search/${state.query}`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const retrieveAlbumSearchResult = async () => {
        setSelectedCategory("Album")
        try {
            const result = await fetch(`http://localhost:3000/spotify/search/${state.query}/album`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const retrieveTrackSearchResult = async () => {
        setSelectedCategory("Track")
        try {
            const result = await fetch(`http://localhost:3000/spotify/search/${state.query}/track`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const retrieveArtistSearchResult = async () => {
        setSelectedCategory("Artist")
        try {
            const result = await fetch(`http://localhost:3000/spotify/search/${state.query}/artist`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const {data: searchArtistResults, isFetching: fetchingArtists, refetch: artistRefetch} = useQuery({
        queryKey: ['aristSearchResults'],
        queryFn: retrieveArtistSearchResult,
    })

    const {data: searchTrackResults, isFetching: fetchingTracks, refetch: trackRefetch} = useQuery({
        queryKey: ['trackSearchResults'],
        queryFn: retrieveTrackSearchResult,
    })

    const {data: searchAlbumResults, isFetching: fetchingAlbums, refetch: albumRefetch} = useQuery({
        queryKey: ['albumSearchResults'],
        queryFn: retrieveAlbumSearchResult,
    })

    const {data: searchResults, isFetching: fetchingEverything, refetch: defaultRefetch} = useQuery({
        queryKey: ['defaultSearchResults'],
        queryFn: retrieveDefaultSearchResult,
    })

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
        console.log(selectedCategory)
    },[defaultRefetch, albumRefetch, trackRefetch, artistRefetch,selectedCategory, state.query])

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
                    (selectedCategory == "Everything" && !fetchingEverything) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Artists</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-4">
                                            {searchResults.type.artists.items.map((data:Artists, i: number) => (
                                                <div className="relative max-w-64 max-h-64 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                    <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                    <ol className="absolute bottom-2 left-2"><a className="text-xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                </div>
                                            ))}    
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="text-accent font-semibold pr-1" type="submit">More</button>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="mt-16">
                                <h1 className="text-3xl mb-2">Albums</h1>
                                <div>
                                    {
                                        <>
                                            <div className="grid grid-cols-4">
                                                {searchResults.type.albums.items.map((data:Artists, i: number) => (
                                                    <div className="relative max-w-64 max-h-64 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                        <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                        <ol className="absolute bottom-2 left-2"><a className="text-xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                    </div>
                                                ))}    
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={retrieveAlbumSearchResult} className="text-accent font-semibold pr-1" type="submit">More</button>
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
                                            <div className="grid grid-cols-4">
                                                {searchResults.type.tracks.items.map((data:Tracks, i: number) => (
                                                    <div className="relative max-w-64 max-h-64 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                        <img className="w-full h-full" src={data.album.images.length !== 0 ? data.album.images[0].url : profile_page} alt="Artist Picture"/>
                                                        <ol className="absolute bottom-2 left-2"><a className="text-xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                    </div>
                                                ))}    
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={retrieveTrackSearchResult} className="text-accent font-semibold pr-1" type="submit">More</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                }
                {
                    (selectedCategory == "Album" && !fetchingAlbums) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Albums</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-2">
                                            {searchAlbumResults.type.albums.items.map((data:Albums, i: number) => (
                                                <div className="flex flex-row gap-2 py-4">
                                                    <div className="max-w-20 max-h-20 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                        <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                    </div>
                                                    <div className="pl-4">
                                                        <ol><a className="text-md font-bold text-black" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                        <p className="text-black text-sm"><a href={data.artists[0].external_urls.spotify}>{data.artists[0].name}</a></p>
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
                    (selectedCategory == "Track" && !fetchingTracks) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Tracks</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-2">
                                            {searchTrackResults.type.tracks.items.map((data:TracksFromSearch, i: number) => (
                                                <div className="flex flex-row gap-2 py-4">
                                                    <div className="max-w-20 max-h-20 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                        <img className="w-full h-full" src={data.album.images.length !== 0 ? data.album.images[0].url : profile_page} alt="Artist Picture"/>
                                                    </div>
                                                    <div className="pl-4">
                                                        <ol><a className="text-md font-bold text-black" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                        <p className="text-black text-sm"><a href={data.artists[0].external_urls.spotify}>{data.artists[0].name}</a></p>
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
                    (selectedCategory == "Artist" && !fetchingArtists) &&
                        <div className="mt-16">
                            <h1 className="text-3xl mb-2">Artists</h1>
                            <div>
                                {
                                    <>
                                        <div className="grid grid-cols-2">
                                            {searchArtistResults.type.artists.items.map((data:Artists, i: number) => (
                                                <div className="flex flex-row gap-2 py-4">
                                                    <div className="max-w-20 max-h-20 bg-gradient-to-t from-gray-300 to-white" key={i}>
                                                        <img className="w-full h-full" src={data.images.length !== 0 ? data.images[0].url : profile_page} alt="Artist Picture"/>
                                                    </div>
                                                    <div className="pl-4">
                                                        <ol><a className="text-md font-bold text-black" href={data.external_urls.spotify}>{data.name}</a></ol>
                                                        <p className="text-black text-sm"><a href={data.external_urls.spotify}>{data.name}</a></p>
                                                    </div>
                                                </div>
                                            ))}    
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                }
            </div>
        </>
    )

    return content
}

export default Search
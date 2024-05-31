import { useLocation } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import profile_page from "../../assets/profile_page.svg"

const Search = () => {

    interface Artists {
        name: string
        images: Image[]
        external_urls: ExternalURLs
    }

    interface Tracks {
        album: Artists
        artists: Artists
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
        try {
            const result = await fetch(`http://localhost:3000/spotify/search/${state.query}`)
            const data = await result.json()
            return data
        } catch (error) {
            throw new Error("Could not search")
        }
    }

    const {data: searchResults, isFetching, refetch} = useQuery({
        queryKey: ['defaultSearchResults'],
        queryFn: retrieveDefaultSearchResult,
    })

    useEffect(() => {
        refetch()
    },[refetch, state.query])

    const content = (
        <>
            <Navbar />
            <div className="mx-64 p-10">
                <div>
                    <p className="text-2xl font-bold">Search Results for "{state.query}"</p>
                    <ul className="flex gap-12 pt-4">
                        <button className="p-2 focus:border-b-2 focus:border-accent">Everything</button>
                        <button className="p-2 focus:border-b-2 focus:border-accent">Album</button>
                        <button className="p-2 focus:border-b-2 focus:border-accent">Track</button>
                    </ul>
                </div>
                {
                    !isFetching &&
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
                                                <button className="text-accent font-semibold pr-1" type="submit">More</button>
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
                                                <button className="text-accent font-semibold pr-1" type="submit">More</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    )

    return content
}

export default Search
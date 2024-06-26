import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Artists, Albums } from "../models/spotifyTypes"
import { URL } from "../models/url"

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

interface ExternalURLs {
    spotify: string;
}

interface propsData {
    data: Artists | Albums | Tracks;
    type: string;
}

const LikeAndDislike = (props: propsData) => {

    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    const { user } = useAuth0()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendLikedItemToUser = async (_data: Artists|Albums|any) => {
        try {
            if (props.type == "track") { // for type tracks
                const response = await fetch(`${URL}/user/add/rated${props.type}`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                    },
                    body: JSON.stringify({
                        name: _data.name,
                        image: _data.album.images[0],
                        artist: _data.artists[0].name,
                        id: _data.id,
                        userEmail: user?.email,
                        type: "liked"
                    })
                })
                const data = await response.json()
                console.log(data)
            } else {
                const response = await fetch(`${URL}/user/add/rated${props.type}`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                    },
                    body: JSON.stringify({
                        name: _data.name,
                        image: _data.images[0],
                        id: _data.id,
                        userEmail: user?.email,
                        type: "liked"
                    })
                })
                const data = await response.json()
                console.log(data)
            }
            
        } catch (error) {
            throw new Error(`Couldn't send liked albums to database: ${error}`)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendDislikedItemToUser = async (_data: Artists|Albums|any) => {
        try {
            if (props.type == "track") { // for type tracks
                const response = await fetch(`${URL}/user/add/rated${props.type}`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: _data.name,
                        image: _data.album.images[0],
                        artist: _data.artists[0].name,
                        id: _data.id,
                        userEmail: user?.email,
                        type: "disliked"
                    })
                })
                const data = await response.json()
                console.log(data)
            } else {
                const response = await fetch(`${URL}/user/add/rated${props.type}`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: _data.name,
                        image: _data.images[0],
                        id: _data.id,
                        userEmail: user?.email,
                        type: "disliked"
                    })
                })
                const data = await response.json()
                console.log(data)
            }
            
        } catch (error) {
            throw new Error(`Couldn't send liked albums to database: ${error}`)
        }
    }

    const gettingLikedAlbums = async () => {
        try {
            const response = await fetch(`${URL}/user/get/ratedalbum`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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
            const response = await fetch(`${URL}/user/get/ratedartist`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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

    const {data: ratedalbum} = useQuery({
        queryKey: ['GettingLikedAlbums'],
        queryFn: gettingLikedAlbums
    })

    const {data: ratedartist} = useQuery({
        queryKey: ['GettingLikedArtists'],
        queryFn: gettingLikedArtists
    })


    useEffect(() => {
        // Try
        // if (ratedalbum.length != 0) without test objects
        // if (Object.keys(ratedalbum).length == 0)
        if (ratedalbum) {
            if (props.data.id in ratedalbum.ratedAlbums.likedAlbums) {
                setLike(true)
            }

            if (props.data.id in ratedalbum.ratedAlbums.dislikedAlbums) {
                setDislike(true)
            }
        }

        if (ratedartist) {
            if (props.data.id in ratedartist.ratedArtist.likedArtists) {
                setLike(true)
            }

            if (props.data.id in ratedartist.ratedArtist.dislikedArtists) {
                setDislike(true)
            }
        }
    }, [ratedalbum, ratedartist, props.data.id])

    const content = (
        <>
        <div className="w-full flex items-center justify-between bg-white p-2">
            <button onClick={() => {
                if (!dislike) {
                    setLike(!like)
                } else if (!dislike === like) {
                    setDislike(!dislike)
                    setLike(!like)
                }

                sendLikedItemToUser(props.data)
            }}>
                <FontAwesomeIcon id="Hello" className={`w-8 h-8 ${like ? 'text-green-400' : 'text-gray-300'}`} icon={faThumbsUp as IconProp} />
            </button>
            <button onClick={() => {
                if (!like) {
                    setDislike(!dislike)
                } else if (!dislike === like) {
                    setLike(!like)
                    setDislike(!dislike)
                }
                sendDislikedItemToUser(props.data)
            }}>
                <FontAwesomeIcon className={`w-8 h-8 ${dislike ? 'text-red-400' : 'text-gray-300'}`} icon={faThumbsDown as IconProp}/>
            </button>
        </div>
        </>
    )

    return content
}

export default LikeAndDislike
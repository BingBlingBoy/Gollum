import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"


interface Artists {
    name: string
    images: Image[]
    href: string
    id: string
}

interface Albums {
    name: string
    images: Image[]
    artists: ArtistFromAlbum[]
    href: string 
    id: string
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

interface propsData {
    data: Artists|Albums,
    type: string
}

interface Album {
    albumName: string;
    albumImage: string;
}

interface RatedAlbums {
    [albumId: string] : Album
}

const LikeAndDislike = (props: propsData) => {

    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    const { user } = useAuth0()

    const sendLikedItemToUser = async (_data: Artists|Albums) => {
        try {
            const response = await fetch(`http://localhost:3000/user/add/rated${props.type}`, {
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
                    type: "liked"
                })
            })
            const data = await response.json()
            console.log(data)
            
        } catch (error) {
            throw new Error(`Couldn't send liked albums to database: ${error}`)
        }
    }

    const sendDislikedItemToUser = async (_data: Artists|Albums) => {
        try {
            const response = await fetch(`http://localhost:3000/user/add/rated${props.type}`, {
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
        } catch (error) {
            throw new Error(`Couldn't add disliked albums to database: ${error}`)
        }
    }

    const gettingLikedAlbums = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/get/ratedalbum', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: user?.email,
                })
                
            })
            const data = response.json()
            return data
        } catch (error) {
            throw new Error(`Couldn't get liked albums: ${error}`)
        }
    }

    const {data: ratedalbum} = useQuery({
        queryKey: ['GettingLikedAlbums'],
        queryFn: gettingLikedAlbums
    })

    useEffect(() => {
        if (ratedalbum) {
            if (props.data.id in ratedalbum.ratedAlbums.likedAlbums) {
                setLike(true)
            }

            if (props.data.id in ratedalbum.ratedAlbums.dislikedAlbums) {
                setDislike(true)
            }
        }
    }, [ratedalbum])

    const content = (
        <div className="w-full flex items-center justify-between bg-gray-50 p-2">
            <button onClick={() => {
                setLike(!like)
                sendLikedItemToUser(props.data)
            }}>
                <FontAwesomeIcon id="Hello" className={`w-8 h-8 ${like ? 'text-green-400' : 'text-gray-300'}`} icon={faThumbsUp as IconProp} />
            </button>
            <button onClick={() => {
                setDislike(!dislike)
                sendDislikedItemToUser(props.data)
            }}>
                <FontAwesomeIcon className={`w-8 h-8 ${dislike ? 'text-red-400' : 'text-gray-300'}`} icon={faThumbsDown as IconProp}/>
            </button>
        </div>
    )

    return content
}

export default LikeAndDislike
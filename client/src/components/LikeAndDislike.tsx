import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from "@auth0/auth0-react"


interface Artists {
    name: string
    images: Image[]
    href: string
}

interface Albums {
    name: string
    images: Image[]
    artists: ArtistFromAlbum[]
    href: string 
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

const LikeAndDislike = (props: propsData) => {

    const { user } = useAuth0()

    const sendLikedItemToUser = async (_data: Artists|Albums) => {
        try {
            console.log(_data.href)
            const response = await fetch(`http://localhost:3000/user/add/liked${props.type}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: _data.name,
                    image: _data.images[0],
                    href: _data.href,
                    userEmail: user?.email
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
            const response = await fetch(`http://localhost:3000/user/add/disliked${props.type}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: _data.name,
                    image: _data.images[0],
                    href: _data.href,
                    userEmail: user?.email
                })
            })
            const data = await response.json()
            console.log(data)
        } catch (error) {
            throw new Error(`Couldn't add disliked albums to database: ${error}`)
        }
    }


    const content = (
        <div className="w-full flex items-center justify-between bg-gray-50 p-2">
            <button onClick={() => {sendLikedItemToUser(props.data)}}>
                <FontAwesomeIcon id="Hello" className="w-8 h-8 text-gray-300" icon={faThumbsUp as IconProp} />
            </button>
            <button onClick={() => {sendDislikedItemToUser(props.data)}}>
                <FontAwesomeIcon className="w-8 h-8 text-gray-300" icon={faThumbsDown as IconProp}/>
            </button>
        </div>
    )

    return content
}

export default LikeAndDislike
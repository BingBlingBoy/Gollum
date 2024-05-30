import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
// import { useEffect } from "react"

interface Token {
    token: {
        access_token: string
        expires_in: number
    }
}

const Playbutton = (props: Token) => {

    // useEffect(() => {
    //
    //     const script = document.createElement("script");
    //     script.src = "https://sdk.scdn.co/spotify-player.js";
    //     script.async = true;
    // 
    //     document.body.appendChild(script);
    // 
    //     window.onSpotifyWebPlaybackSDKReady = () => {
    // 
    //         const player = new window.Spotify.Player({
    //             name: 'Web Playback SDK',
    //             getOAuthToken: cb => { cb(props.token); },
    //             volume: 0.5
    //         });
    // 
    //         setPlayer(player);
    // 
    //         player.addListener('ready', ({ device_id }) => {
    //             console.log('Ready with Device ID', device_id);
    //         });
    // 
    //         player.addListener('not_ready', ({ device_id }) => {
    //             console.log('Device ID has gone offline', device_id);
    //         });
    // 
    // 
    //         player.connect();
    // 
    //     };
    // }, []);

    const webPlayback = async () => {
        try {
            const response = await fetch("http://localhost:3000/spotify/getToken")
            const result = await response.json()

            console.log(result)
            console.log(props.token.access_token)

        } catch (error) {
            return error
        }
    }

    const content = (
        <>
            <button onClick={webPlayback} className="absolute top-7 left-2 w-12 h-12 rounded-full bg-white focus:outline-none">
                <FontAwesomeIcon className="w-4 h-4 text-black" icon={faPlay as IconProp} />
            </button>
        </>
    )

    return content
}

export default Playbutton
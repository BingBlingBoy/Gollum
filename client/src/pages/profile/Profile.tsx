import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../../components/Navbar"
import { useEffect, useState } from "react";

const CLIENT_ID = "1466b5977d204641aa0538b887b91e9e"; // insert your client id here from spotify
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:5173/profile";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
  "user-library-read",
  "user-read-recently-played"
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

interface Map {
    [key: string]: string | undefined
}

interface SpotifyToken {
    display_name: string,
    images: Images[]
}

interface Images {
    url: string
}

const getReturnedParamsFromSpotifyAuth = (hash: string) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulator: Map, currentValue) => {
      console.log(currentValue);
      const [key, value] = currentValue.split("=");
      accumulator[key] = value;
      return accumulator;
    }, {});
  
    return paramsSplitUp;
  };

const Profile = () => {

    const { user } = useAuth0()
    const [userHasToken, setUserHasToken] = useState(false)
    const [userSpotifyToken, setSpotifyToken] = useState<SpotifyToken>()

    useEffect(() => {
        if ((localStorage.getItem("accessToken"))) {
            setUserHasToken(true)
            getUserRecentTracks()
            linkSpotifyAccount()
        }
        if (window.location.hash) {
            const { access_token, expires_in, token_type } =
            getReturnedParamsFromSpotifyAuth(window.location.hash);

            localStorage.clear();

            if (access_token && token_type && expires_in) {
                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("tokenType", token_type);
                localStorage.setItem("expiresIn", expires_in);
                setUserHasToken(true)
                linkSpotifyAccount()
                getUserRecentTracks()
            }
        }
        setInterval(handleSpotifyLoginRefetch, 18000000)

        console.log(user)

    }, []);


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
            console.log(data)
        } catch (error) {
            throw new Error(`Couldn't get users recent tracks: ${error}`)    
        }    
    } 

    
    const handleSpotifyLoginRefetch = () => {
        window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    };

    const handleSpotifyLogin = () => {
        if (!(localStorage.getItem("accessToken"))) {
            window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
        }
    };

    const linkSpotifyAccount = async () => {
        try {
            const aT = localStorage.getItem("accessToken")
            console.log(aT)
            const spotifyAccount = await fetch(`http://localhost:3000/spotify/getUserToken/`, {
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
            console.log(data)
            setSpotifyToken(data)
        } catch (error) {
            throw new Error("Couldn't get spotify account")
        }
    }

    const content = (
        <>
            <Navbar />
            {!userHasToken && 
                <button onClick={handleSpotifyLogin}>Link Spotify Account</button>
            }
            <div className="mt-24 flex items-center justify-center flex-col">
                <div className="text-white bg-primary rounded-md flex justify-between p-10 gap-x-16 max-w-7xl">
                    <div className="flex gap-x-10">
                        <div>
                            <img className="w-36 h-36 rounded-full outline outline-black" src={userSpotifyToken?.images[1].url} alt="" />
                        </div>
                        <div className="">
                            <h1 className="pb-2 font-bold text-3xl">{user?.name}</h1>
                            <p>Spotify Name: {userSpotifyToken?.display_name}</p>
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
            </div>

        </>
    )

    return content
}

export default Profile
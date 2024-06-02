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
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

interface Map {
    [key: string]: string | undefined
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

    useEffect(() => {
        if ((localStorage.getItem("accessToken"))) {
            setUserHasToken(true)
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
            }
        }
        setInterval(linkSpotifyAccount, 60000)

    }, []);
    
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
        } catch (error) {
            throw new Error("Couldn't get spotify account")
        }
    }

    // const {data: spotifyAccount} = useQuery({
    //     queryKey: ["SpotifyAccount"],
    //     queryFn: linkSpotifyAccount
    // })

    const content = (
        <>
            <Navbar />
            {!userHasToken && 
                <button onClick={handleSpotifyLogin}>Link Spotify Account</button>
            }

        </>
    )

    return content
}

export default Profile
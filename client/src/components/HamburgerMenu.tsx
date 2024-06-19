import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faBars, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Searchbar from "./Searchbar"
import { useAuth0 } from "@auth0/auth0-react"

const HamburgerMenu = () => {
    const [openNav, setOpenNav] = useState(false)

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    
    interface Map {
        [key: string]: string | undefined
    }

    const CLIENT_ID = "1466b5977d204641aa0538b887b91e9e";
    const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
    const REDIRECT_URL_AFTER_LOGIN = "http://localhost:5173/";
    const SPACE_DELIMITER = "%20";
    const SCOPES = [
      "user-read-currently-playing",
      "user-read-playback-state",
      "playlist-read-private",
      "user-library-read",
      "user-read-recently-played"
    ];
    const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

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

    const authenticateSpotify = () => {
        window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    }

    useEffect(() => {
        if (window.location.hash) {
            const { access_token, expires_in, token_type } =
            getReturnedParamsFromSpotifyAuth(window.location.hash);

            localStorage.clear();

            if (access_token && token_type && expires_in) {
                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("tokenType", token_type);
                localStorage.setItem("expiresIn", expires_in);
            }
        }
    },[])


    
    const content = (
        <>  
            {
                !openNav &&
                    <>
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-4xl transition delay-75 hover:scale-110"><Link to={`/`}>G<span className="text-accent">oll</span>um</Link></h1>
                            <button className="pt-1" onClick={() => (setOpenNav(!openNav))}>
                                <FontAwesomeIcon className="w-8 h-8 text-white" icon={faBars as IconProp} />
                            </button>
                        </div>
                    </>
            }
            <div className={openNav ? "w-full h-screen bg-primary relative" : "hidden"}>
                <button className="absolute top-1 right-0" onClick={() => (setOpenNav(!openNav))}>
                    <FontAwesomeIcon className="w-8 h-8 text-white" icon={faX as IconProp} />
                </button>

                <div className="flex flex-col items-center justify-center w-full h-full">
                    <ul className="flex flex-col gap-y-8 items-center text-lg text-nowrap font-bold">
                        <Searchbar />
                        <li className="transition delay-75 hover:scale-125 hover:text-accent"><Link to={`/`}>Home</Link></li>
                        {(localStorage.getItem("accessToken")) ?
                            <>
                                {isAuthenticated ?
                                    <>
                                        <li className="transition delay-75 hover:scale-125 hover:text-accent"><Link to={`/profile`}>{user?.name}</Link></li> 
                                        <button className="transition delay-75 hover:scale-125 hover:text-accent" onClick={() =>{ 
                                            localStorage.clear()
                                            window.location.reload()
                                            logout({ logoutParams: { returnTo: window.location.origin } })
                                        }}>
                                            Log Out
                                        </button>
                                    </>
                                    :
                                    <button className="transition delay-75 hover:scale-125 hover:text-accent" onClick={() => loginWithRedirect()}>Sign up/Log In</button>
                                }
                            </>
                            :
                            <li><button className="transition delay-75 hover:scale-125 hover:text-accent" onClick={authenticateSpotify}>Authenticate Spotify</button></li>
                        }
                    </ul>
                </div>
            </div>
        </>
    )
    
    return content
}

export default HamburgerMenu
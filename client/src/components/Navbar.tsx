import { Link } from "react-router-dom"
import Searchbar from "./Searchbar"
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import HamburgerMenu from "./HamburgerMenu";

interface Map {
    [key: string]: string | undefined
}

const Navbar = () => {

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const CLIENT_ID = "1466b5977d204641aa0538b887b91e9e";
    const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
    const REDIRECT_URL_AFTER_LOGIN = "https://gollum-kappa.vercel.app/";
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
            <nav className="px-6 py-3 bg-primary text-white flex flex-row font-aileron justify-between items-center sticky top-0 z-50">
                <div className="lg:hidden w-full">
                    <HamburgerMenu />
                </div>
                <div className="hidden lg:flex items-center justify-between w-full">
                    <h1 className="font-bold text-4xl transition delay-75 hover:scale-110"><Link to={`/`}>G<span className="text-accent">oll</span>um</Link></h1>
                    <Searchbar />
                    <ul className="flex flex-row gap-x-8 text-lg text-nowrap font-bold">
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
            </nav>
        </>
    )
    return content
}

export default Navbar
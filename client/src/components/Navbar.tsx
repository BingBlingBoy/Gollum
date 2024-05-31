import { Link } from "react-router-dom"
import Searchbar from "./Searchbar"
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {

    const { loginWithRedirect } = useAuth0();
    const content = (
        <>
            <nav className="px-6 py-3 bg-primary text-white flex flex-row font-aileron justify-between items-center">
                <h1 className="font-bold text-4xl"><Link to={`/`}>G<span className="text-accent">oll</span>um</Link></h1>
                <Searchbar />
                <ul className="flex flex-row gap-x-8 text-lg text-nowrap">
                    <li><Link to={`/`}>Home</Link></li>
                    <button onClick={() => loginWithRedirect()}>Sign up/Log In</button>
                </ul>
            </nav>
        </>
    )
    return content
}

export default Navbar
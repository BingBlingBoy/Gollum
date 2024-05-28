import { Link } from "react-router-dom"

const Navbar = () => {
    const content = (
        <>
            <nav className="mx-14 my-10 flex flex-row font-aileron justify-between items-center">
                <h1 className="font-bold text-4xl"><Link to={`/`}>G<span className="text-accent">oll</span>um</Link></h1>
                <ul className="flex flex-row gap-x-8 text-lg">
                    <li><Link to={`/`}>Home</Link></li>
                    <li>Signup</li>
                </ul>
            </nav>
        </>
    )
    return content
}

export default Navbar
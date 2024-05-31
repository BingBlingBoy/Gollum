import { useAuth0 } from "@auth0/auth0-react"
import Navbar from "../../components/Navbar"
import Newreleases from "../../components/Newreleases"

const Index = () => {

    const {
        user,
        isAuthenticated
    } = useAuth0()

    const content = (
        <>
            <Navbar />
            {isAuthenticated && <h1>Hello, {user ? <h1>{user.email}</h1> : ""}</h1>}
            <div className="p-10 gap-y-4 flex items-center justify-center flex-col h-96">
                <h1 className="font-bold text-5xl">Welcome to G<span className="text-accent">oll</span>um</h1>
                <p className="text-center w-[70ch]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Velit non incidunt necessitatibus odit cumque, consequuntur ullam.
                    Consequatur odit debitis totam. Dignissimos, enim corrupti.
                    Suscipit, consectetur? Iusto nesciunt voluptates eaque dolorem?
                </p>
            </div>
            <Newreleases />
        </>
    )

    return content
}

export default Index
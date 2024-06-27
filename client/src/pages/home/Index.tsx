import { useAuth0 } from "@auth0/auth0-react"
import Navbar from "../../components/Navbar"
import Newreleases from "../../components/Newreleases"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import Footer from "../../components/Footer"
import { Data } from "../../models/userTypes"
import { URL } from "../../models/url"
import { Bounce, ToastContainer } from "react-toastify"
// import { useMutation } from "@tanstack/react-query"

const Index = () => {

    const {
        user,
        isAuthenticated
    } = useAuth0()

    const registerUser = async (send: Data) => {
        try {
            const response = await fetch(`${URL}/user/register`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                body: JSON.stringify(send) 
            })

            const data = await response.json()
            return data
        } catch (error) {
            throw new Error(`Couldn't register new user: ${error}`)
        }
    }


    const { mutateAsync: registerUserMutation } = useMutation({
        mutationFn: registerUser
    })

    useEffect(() => {
        if (isAuthenticated) {
            const data = {
                name: user?.name,
                email: user?.email
            }

            registerUserMutation(data)
        }
    }, [isAuthenticated, registerUserMutation, user?.email, user?.name])

    const content = (
        <>
            <Navbar />
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
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            <Footer />
        </>
    )

    return content
}

export default Index
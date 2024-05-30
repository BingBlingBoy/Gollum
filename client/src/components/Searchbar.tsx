import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Searchbar = () => {

    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        console.log(query)
    },[query])

    const search = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        navigate("/search", { state: { query } })
    }

    const content = (
        <>
            <form onSubmit={search} className="w-full mx-4">
                <input onChange={(e) => {setQuery(e.target.value)}} className="w-full p-2 outline-none rounded-full bg-teal-500 placeholder: pl-4 text-white placeholder-white " type="text" placeholder="Search for music..."/>
            </form>
        </>
    )

    return content
}

export default Searchbar
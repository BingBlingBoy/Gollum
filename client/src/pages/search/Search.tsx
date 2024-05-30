import { useLocation } from "react-router-dom"

const Search = () => {

    const { state } = useLocation()

    const content = (
        <>
            <div>
                <p className="text-3xl font-bold">{state.query}</p>
            </div>
        </>
    )

    return content
}

export default Search
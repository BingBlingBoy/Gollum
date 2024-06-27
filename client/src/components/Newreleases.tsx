import { useQuery } from "@tanstack/react-query"
import { Albums, Artists } from "../models/spotifyTypes"
import { retrieveNewAlbumReleases } from "../api/spotify/SpotifyAPI"
import 'react-toastify/ReactToastify.css'
import { toast } from "react-toastify"

const Newreleases = () => {


  const {data: newReleases, error, isLoading } = useQuery({
    queryKey: ['newReleases'],
    queryFn: retrieveNewAlbumReleases,
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error(error.message, {
      toastId: 'success1',
    })
    return (
      <h1>HELLO</h1>
    )
  }

  const content = (
    <>
    
      <div className="p-10 flex flex-col items-center justify-center bg-best-gray">
        <h1 className="text-5xl p-4 font-bold">New Releases</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4">
          {newReleases.map((data: Albums, i:number) => (
            <div className="relative flex justify-center flex-col py-4" key={i}>
              <img src={data.images[0].url} alt="album picture" />
              <p className="absolute bottom-10 left-4 font-semibold py-2 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-xl">{data.name}</p>
              {data.artists.map((d: Artists, j: number) => (
                <p className="absolute bottom-7 left-4 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-md" key={j}>{d.name}</p>
              ))}
            </div>
          ))} 
        </div>
      </div>
    </>
  )

  return content
}

export default Newreleases
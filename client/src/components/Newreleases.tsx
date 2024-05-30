import { useQuery } from "@tanstack/react-query"

const Newreleases = () => {

  interface albums {
    id: string
    name: string
    artists: Artists[]
    images: Image[]
  }

  interface Artists {
    name: string,
  }

  interface artist {
    name: string
  }

  interface Image {
    height?: number
    url: string
    width?: number
  }

  const retrieveNewAlbumReleases = async () => {
    try {
      const response = await fetch('http://localhost:3000/spotify/newReleases')
      const data = await response.json()
      return data.albums.items
    } catch (error) {
      return error
    }
  }

  // const webPlayback = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/spotify/getToken")
  //     const data = await response.json()
  //
  //     return data
  //
  //   } catch (error) {
  //     throw new Error("failed to get token")
  //   }
  // }

  const {data: newReleases, error, isLoading} = useQuery({
    queryKey: ['newReleases'],
    queryFn: retrieveNewAlbumReleases
  })

  // const {data: getToken} = useQuery({
  //   queryKey: ['get_token'],
  //   queryFn: webPlayback 
  // })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const content = (
    <>
      <div className="p-10 flex items-center justify-center bg-best-gray">
        <div className="grid grid-cols-3 gap-x-4">
          {newReleases.map((data: albums, i:number) => (
            <div className="relative flex justify-center flex-col py-4" key={i}>
              <img src={data.images[0].url} alt="album picture" />
              <p className="absolute bottom-10 left-4 font-semibold py-2 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-xl">{data.name}</p>
              {data.artists.map((d: artist, j: number) => (
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
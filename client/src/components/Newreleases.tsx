import { useQuery } from "@tanstack/react-query"

const Newreleases = () => {

  const retrieveAccessToken = async () => {
    try {
      const response = await fetch('http://localhost:3000/spotify/getToken')
      const data = await response.json()
      return data
    } catch (error) {
      return error
    }
  }

  const { data: token, error, isLoading } = useQuery({
    queryKey: ['spotifyToken'],
    queryFn: retrieveAccessToken,
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const content = (
    <h1 className="text-3xl font-bold">{token?.access_token}</h1>
  )

  return content
}

export default Newreleases
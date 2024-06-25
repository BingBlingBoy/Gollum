interface Artists {
    name: string
    id: string
    images: Image[]
    external_urls: ExternalURLs
    href: string
}

interface Albums {
    name: string
    id: string
    images: Image[]
    external_urls: ExternalURLs
    href: string 
    artists: Artists[]
}

interface Image {
    url: string
}

interface ExternalURLs {
    spotify: string
}

interface SpotifyToken {
    display_name: string,
    images: Image[]
}

interface Track {
    track: TracksFromSearch;
}

interface TracksFromSearch {
    album: Albums 
    artists: Artists[] 
    external_urls: ExternalURLs
    name: string
}

export type {
    Albums,
    Artists,
    SpotifyToken,
    Track
}
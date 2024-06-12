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

export type {
    Albums,
    Artists 
}
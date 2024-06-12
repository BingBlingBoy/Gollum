interface Image {
    url: string
}

interface RatedArtist {
    [artistId: string]: Artist
}

interface RatedAlbums {
    [albumId: string] : Album
}

interface Artist {
    artistName: string
    artistImage: string
}

interface Album {
    albumName: string;
    albumImage: string;
}

export type {
    Image,
    RatedAlbums,
    RatedArtist
}
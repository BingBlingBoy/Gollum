interface Image {
    url: string
}

interface RatedArtist {
    [artistId: string]: Artist
}

interface RatedAlbums {
    [albumId: string] : Album
}

interface RatedTracks {
    [trackId: string] : Track
}

interface Artist {
    artistName: string
    artistImage: string
}

interface Album {
    albumName: string;
    albumImage: string;
}

interface Track {
    trackName: string
    imageURL: string
    artistName: string
}

export type {
    Image,
    RatedAlbums,
    RatedArtist,
    RatedTracks
}
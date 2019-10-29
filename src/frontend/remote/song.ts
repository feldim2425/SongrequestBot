
export enum Source {
    YOUTUBE = "yt",
    SPOTIFY = "spotify",
    SOUNDCLOUD = "soundcloud"
}

const SOURCE_NAMES = {
    [Source.YOUTUBE]: 'Youtube',
    [Source.SPOTIFY]: 'Spotify',
    [Source.SOUNDCLOUD]: 'Soundcloud'
}

export default class Song {
    private _source: Source
    private _url: string
    private _name: string
    private _requester: string

    constructor(source: Source, url: string, name: string, requester: string){
        this._name = name
        this._source = source
        this._url = url
        this._requester = requester
    }

    public get source() : Source{
        return this._source
    }

    public get source_readable() : string{
        return SOURCE_NAMES[this.source];
    }

    public get url() : string {
        return this._url
    }

    public get name() : string {
        return this._name
    }

    public get requester() : string {
        return this._requester
    }
}
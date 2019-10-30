import _ from 'lodash'

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

export function songFromCmdObject(obj:any) : Song | undefined{
    return undefined //TODO: implement songFromCmdObject
}

export function songsFromCmdObjects(objs:any[]) : Song[]{
    let songs: Song[] = []
    for(const obj of objs){
        let song = songFromCmdObject(obj)
        if(!_.isNil(song)){
            songs.push(song)
        }
    }
    return songs
}

export default class Song {
    private _source: Source
    private _url: string
    private _name: string
    private _requester: string
    private _uuid: string

    constructor(source: Source, url: string, name: string, requester: string, uuid: string){
        this._name = name
        this._source = source
        this._url = url
        this._requester = requester
        this._uuid = uuid
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

    public get uuid() : string {
        return this._uuid
    }
}
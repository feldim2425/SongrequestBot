import _ from 'lodash'
import mapArguments, { ArgMapOptions } from '../utils/argarray'

export enum Source {
    YOUTUBE = 'yt',
    SPOTIFY = 'spotify',
    SOUNDCLOUD = 'soundcloud'
}

const SOURCE_NAMES = {
    [Source.YOUTUBE]: 'Youtube',
    [Source.SPOTIFY]: 'Spotify',
    [Source.SOUNDCLOUD]: 'Soundcloud'
}

export function songFromCmdObject(obj:any) : Song | undefined{
    const SONG_OBJ_ATTRS : ArgMapOptions[] = [
        {key: 'source', checkFunction: _.isString},
        {key: 'url', checkFunction: _.isString},
        {key: 'name', checkFunction: _.isString},
        {key: 'requester', checkFunction: _.isString},
        {key: 'uuid', checkFunction: _.isString}
    ]

    if(!_.isObject(obj)){
        return undefined
    }

    let map = mapArguments(SONG_OBJ_ATTRS, obj)
    if(_.isString(map)){
        console.error(map)
        return undefined
    }

    if(map.length < 5 || !Object.values(Source).includes(map[0])){
        console.error('Malformed song arguments')
        return undefined
    }

    return new Song(map[0], map[1], map[2], map[3], map[4])
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
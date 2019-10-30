import Vuex, {ActionContext, Store} from "vuex"
import Vue from "vue"
import Song, { Source } from './song'
import uuidv4 from 'uuid/v4'

Vue.use(Vuex);

export type State = {
    songlist: Song[]
}

const store = new Vuex.Store<State>({
    state: {
        songlist: [new Song(Source.YOUTUBE, '', 'Noisestorm - Crab Rave [Monstercat Release]', 'trojaner', uuidv4()), 
        new Song(Source.SPOTIFY, '', 'Different Seas', 'feldim2425', uuidv4())]
    },
    actions: {
        addSongs(context: ActionContext<State,State>, song: Song[]){
            context.commit('addSongs', song)
        },
        removeSongs(context: ActionContext<State,State>, song: Song){
            context.commit('removeSong', song)
        },
    },
    mutations: {},
    getters: {},
    modules: {},
})

export type VuexStoreType = Store<State>
export default store
import Vuex, {ActionContext, Store} from "vuex"
import Vue from "vue"
import Song, { Source } from './song'
import uuidv4 from 'uuid/v4'
import _ from 'lodash';

Vue.use(Vuex);

export type State = {
    songlist: Song[]
}

const store = new Vuex.Store<State>({
    state: {
        songlist: []
    },
    actions: {
        addSongs(context: ActionContext<State,State>, songs: Song[]){
            context.commit('addSongs', songs)
        },

        setSongs(context: ActionContext<State,State>, songs: Song[]){
            if(!_.isEqual(context.state.songlist,songs)){
                context.commit('setSongs', songs)
            }
        },
        removeSongs(context: ActionContext<State,State>, songs: Song){
            context.commit('removeSong', songs)
        },
    },
    mutations: {
        setSongs(state:State, songs: Song[]): void{
            state.songlist = songs
        }
    },
    getters: {},
    modules: {},
})

export type VuexStoreType = Store<State>
export default store
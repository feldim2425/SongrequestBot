import Vuex, {ActionContext} from "vuex";
import Vue from "vue";
import Song, { Source } from './song';

Vue.use(Vuex);

export type State = {
    songlist: Song[]
}

const store = new Vuex.Store<State>({
    state: {
        songlist: [new Song(Source.YOUTUBE, '', 'Noisestorm - Crab Rave [Monstercat Release]', 'trojaner'), 
        new Song(Source.SPOTIFY, '', 'Different Seas', 'feldim2425')]
    },
    actions: {
        addSong(context: ActionContext<State,State>, song: Song){
            context.commit('addSong', song)
        },
        removeSong(context: ActionContext<State,State>, song: Song){
            context.commit('removeSong', song)
        },
    },
    mutations: {},
    getters: {},
    modules: {},
})

export default store
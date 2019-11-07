import Vuex, {ActionContext, Store} from "vuex"
import Vue from "vue"
import Song, { Source } from './song'
import uuidv4 from 'uuid/v4'
import _ from 'lodash';

Vue.use(Vuex);

export type State = {
    songlist: Song[],
    config: object
}

const store = new Vuex.Store<State>({
    state: {
        songlist: [],
        config: {}
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

        updateConfig(context: ActionContext<State,State>, cfg: object){
            if(!_.isEqual(context.state.config, cfg)){
                context.commit('setConfig', _.cloneDeep(cfg))
            }
        },

        applyConfigMutations(context: ActionContext<State,State>, cfg: object){
            const changed = _.defaultsDeep({}, cfg, context.state.config)
            if(!_.isEqual(changed, context.state.config)){
                context.commit('setConfig', this.getters.editingConfig)
            }
        }
    },
    mutations: {
        setSongs(state:State, songs: Song[]): void{
            state.songlist = songs
        },

        setConfig(state:State, cfg: object): void {
            state.config = cfg
        }
    },
    getters: {},
    modules: {},
})

export type VuexStoreType = Store<State>
export default store
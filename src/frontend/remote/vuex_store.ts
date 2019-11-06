import Vuex, {ActionContext, Store} from "vuex"
import Vue from "vue"
import Song, { Source } from './song'
import uuidv4 from 'uuid/v4'
import _ from 'lodash';

Vue.use(Vuex);

export type State = {
    songlist: Song[],
    config: object,
    configMutations: object
}

const store = new Vuex.Store<State>({
    state: {
        songlist: [],
        config: {},
        configMutations: {}
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

        clearConfigMutations(context: ActionContext<State,State>){
            if(!_.isEmpty(context.state.configMutations)){
                context.commit('setConfigMutations', {})
            }
        },

        applyConfigMutations(context: ActionContext<State,State>){
            const changed = this.getters.editingConfig
            if(!_.isEqual(changed, context.state.config)){
                context.commit('setConfig', this.getters.editingConfig)
            }
        },

        putConfigMutation(context: ActionContext<State,State>, cfg: object): void{
            let changed = _.defaultsDeep({}, cfg, context.state.configMutations)
            if(!_.isEqual(changed, context.state.configMutations)){
                context.commit('setConfigMutations', changed)
            }
        }
    },
    mutations: {
        setSongs(state:State, songs: Song[]): void{
            state.songlist = songs
        },

        setConfig(state:State, cfg: object): void {
            state.config = cfg
        },

        setConfigMutations(state:State, cfg: object): void{
            state.configMutations = cfg
        },
    },
    getters: {
        editingConfig(state: State) : object{
            return _.defaultsDeep({}, state.configMutations, state.config)
        }
    },
    modules: {},
})

export type VuexStoreType = Store<State>
export default store
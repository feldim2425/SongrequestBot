import Vuex, {ActionContext, Store} from "vuex"
import Vue from "vue"
import Song, { Source } from './song'
import uuidv4 from 'uuid/v4'
import _ from 'lodash';
import { Message } from '~common/remote/message';

Vue.use(Vuex);

export type State = {
    songlist: Song[],
    config: object,
    messages: Message[]
}

const store = new Vuex.Store<State>({
    state: {
        songlist: [],
        config: {},
        messages: []
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
            const changed = _.defaultsDeep(_.cloneDeep(cfg), context.state.config)
            if(!_.isEqual(changed, context.state.config)){
                context.commit('setConfig', changed)
            }
        },

        addMessage(context: ActionContext<State,State>, msg: Message){
            if(_.find(context.state.messages, (cmsg,index,arr) => cmsg.id.toLowerCase()===msg.id.toLowerCase()) === undefined){
                const msgs = _.cloneDeep(context.state.messages)
                msgs.push(msg)
                context.commit('setMessages', msgs)
            }
        },

        setMessages(context: ActionContext<State,State>, msg: Message[]){
            if(!_.isEqual(context.state.messages, msg)){
                context.commit('setMessages', _.uniqBy(_.cloneDeep(msg), 'id'))
            }
        },

        removeMessage(context: ActionContext<State,State>, msg: Message | string | number){
            const msgs = _.cloneDeep(context.state.messages)

            if(_.isObject(msg)){
                msg = msg.id
            }

            if(_.isString(msg)){
                msg = msg.toLowerCase()
                const result = _.findIndex(msgs, (imsg, i, arr) => imsg.id.toLowerCase() === msg)
                if(result === undefined){
                    return
                }
                msg = result
            }

            if(_.isInteger(msg) && msg >= 0 && msg < msgs.length){
                delete msgs[msg]
                _.remove(msgs, _.isNil)
                context.commit('setMessages',msgs)
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

        setMessages(state:State, messages: Message[]): void {
            state.messages = messages
        }
    },
    getters: {},
    modules: {},
})

export type VuexStoreType = Store<State>
export default store
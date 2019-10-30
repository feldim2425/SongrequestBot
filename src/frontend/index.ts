import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import App from './app.vue'
import Settings from './screens/settings.vue'
import store from './remote/vuex_store'
import BackendConnection from './remote/websocket'

Vue.use(BootstrapVue)

const connection = new BackendConnection()
connection.connect()
connection.on('connected', (event) => {
    console.log('Backend connected')
})
connection.on('closed', (event) => {
    console.log('Backend disconnected')
})
connection.on('error', (event) => {
    console.error(event)
})

const vueApp = new Vue({
    store,
    render(draw) {
        return draw(App, {
            props: {
                connection: connection
            }
        })
    }
});

vueApp.$mount('#app');

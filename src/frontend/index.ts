import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import App from './app.vue'
import Settings from './screens/settings.vue'
import store from './remote/vuex_store'

Vue.use(BootstrapVue)


const vueApp = new Vue({
    store,
    render: (draw) => draw(App)
});


vueApp.$mount('#app');

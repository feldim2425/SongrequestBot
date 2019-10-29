<template>
    <div>
        <Navbar/>
        <StatusPanel/>
        <div>
            <b-modal v-model="showModal" hide-footer>
                <router-view/>
                <b-button class="mt-3" block>Close Me</b-button>
            </b-modal>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Prop} from 'vue-property-decorator'
import Navbar from './components/navbar.vue'
import StatusPanel from './screens/status.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component({
    name: 'App',
    components: {Navbar, StatusPanel}
})
export default class App extends Vue {

    get showModal() : boolean{
        return false
    }

}

</script>

<style lang='scss'>
    body {
        margin: 0;
        background: #0c1015
    }
</style>
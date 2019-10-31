<template>
    <div>
        <Navbar @settings-open="$bvModal.show('settings-modal')"/>
        <StatusPanel/>
        <div>
            <b-modal id="connection-modal" title="Connection lost" @close="cancelEvent" @cancel="cancelEvent" @ok="cancelEvent" @hide="cancelEvent">
                <template v-slot:default="{ hide }">
                    <p>Connection to backend lost!
                    Please check if the backend is running and try again!</p>
                </template>

                <template v-slot:modal-footer>
                    <b-button @click="retry">Retry</b-button>
                </template>
            </b-modal>
        </div>
        <Settings modalId="settings-modal" @settings-close="showSettings = false"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Prop} from 'vue-property-decorator'
import Navbar from './components/navbar.vue'
import StatusPanel from './screens/status.vue'
import Settings from './screens/settings.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BackendConnection from './remote/websocket'

@Component({
    name: 'App',
    components: {Navbar, StatusPanel, Settings}
})
export default class App extends Vue {

    @Prop()
    public connection: BackendConnection
    public connected: boolean = false

    public showSettings: boolean = false

    private boundConnect = this.setConnection.bind(this, true)
    private boundDisconnect = this.setConnection.bind(this, false)

    public mounted(){
        this.connection.on('connected', this.boundConnect)
        this.connection.on('closed', this.boundDisconnect)
    }

    public destroyed(){
        this.connection.off('connected', this.boundConnect)
        this.connection.off('closed',  this.boundDisconnect)
    }

    public setConnection(value: boolean){
        this.connected = value
        if(value){
            this.$bvModal.hide('connection-modal')
        }
        else {
            this.$bvModal.show('connection-modal')
        }
    }

    public retry(){
        this.connection.connect()
    }

    public cancelEvent(event: any){
        if(!this.connected){
            this.retry()
            event.preventDefault()
        }
    }
}

</script>

<style lang='scss'>
    body {
        margin: 0;
        background: #0c1015
    }
</style>
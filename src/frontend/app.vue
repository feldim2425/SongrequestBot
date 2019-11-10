<template>
    <div>
        <Navbar @settings-open="$bvModal.show('settings-modal')" @message-open="$bvModal.show('info-modal')" @logout="logoutUser"/>
        <StatusPanel/>
        <LoginPanel :loggedon="loggedin" @login="submitLogin"/>
        <ConnectionPanel :connected="connected" @retry="retry"/>
        <InfoPanel modalId="info-modal"/>
        <Settings :connection="connection" modalId="settings-modal"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Prop} from 'vue-property-decorator'
import Navbar from './components/navbar.vue'
import StatusPanel from './screens/status.vue'
import Settings from './screens/settings.vue'
import ConnectionPanel from './screens/conlost.vue'
import LoginPanel from './screens/login.vue'
import InfoPanel from './screens/infopanel.vue'
import BackendConnection from './remote/websocket'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


const CONNECTION_EVENTS = ['connected', 'closed', 'loggedin', 'loggedout']

@Component({
    name: 'App',
    components: {Navbar, StatusPanel, Settings, ConnectionPanel, LoginPanel, InfoPanel}
})
export default class App extends Vue {

    @Prop()
    public connection: BackendConnection
    public connected: boolean = false
    public loggedin: boolean = false

    private boundUpdate = this.updateConnection.bind(this)


    public mounted(){
        for(const ev of CONNECTION_EVENTS){
            this.connection.on(ev, this.boundUpdate)
        }
        this.updateConnection()
    }

    public destroyed(){
        for(const ev of CONNECTION_EVENTS){
            this.connection.off(ev, this.boundUpdate)
        }
    }

    public logoutUser(){
        this.connection.sendCommand('logout')
    }

    public updateConnection(){
        this.connected = this.connection.open
        this.loggedin = this.connection.loggedin || !this.connected  
    }

    public submitLogin(pwd: string){
        this.connection.submitLogin(pwd)
    }

    public retry(){
        this.connection.connect()
    }
}

</script>

<style lang='scss'>
    body {
        margin: 0;
        background: #0c1015
    }
</style>
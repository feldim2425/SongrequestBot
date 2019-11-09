<template>
    <div>
        <b-modal :visible="!connected" title="Connection lost" @hide="cancelEvent">
            <template v-slot:default="{ hide }">
                <p>Connection to backend lost!
                Please check if the backend is running and try again!</p>
            </template>

            <template v-slot:modal-footer>
                <b-button @click="retry">Retry</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";

@Component({
    name: 'connection-panel'
})
export default class ConnectionPanel extends Vue{
    
    @Prop({default: false})
    public connected: boolean 

    public retry(){
        this.$emit('retry')
    }

    public cancelEvent(event: any){
        if(!this.connected){
            this.retry()
            event.preventDefault()
        }
    }
}
</script>
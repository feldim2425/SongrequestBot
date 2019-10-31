<template>
    <b-modal :id="modalId" title="Settings" @ok="handleOk" @close="handleOk" @hide="handleOk" ok-only>
        <template v-slot:default>
            <b-tabs content-class="mt-3">
                <b-tab title="General" active>
                    <h5>General</h5>
                </b-tab>
                <b-tab title="Twitch">
                    <h5>Twitch Settings</h5>
                    <b-button pill size="sm" href="https://twitchapps.com/tmi/" rel="noopener noreferrer" target="_blank">Get OAuth Token [Don't show this publicly!]</b-button>
                </b-tab>
                <b-tab title="Spotify">
                    <h5>Spotify Settings</h5>
                </b-tab>
                <b-tab title="Discord">
                    <h5>Discord Settings</h5>
                </b-tab>
            </b-tabs>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from "vue-property-decorator";

@Component({
    name: 'Settings'
})
export default class Settings extends Vue{
    @Prop({default: 'settings-modal'})
    public modalId:string

    public handleOk(event: any){
        this.$emit('settings-close')
    }
}
</script>

<style lang="scss" scoped>
</style>
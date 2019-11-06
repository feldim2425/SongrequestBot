<template>
    <b-modal :id="modalId" title="Settings" @ok="confApply" @cancel="confReset" @hide="handleHide">
        <template v-slot:default>
            <b-tabs content-class="mt-3">
                <b-tab title="General" active>
                    <h5>General</h5>
                </b-tab>
                <b-tab title="Twitch">
                    <h5>Twitch Settings {{settings.logins.twitch.enabled}}</h5>
                    <twitch-settings v-model="settings"/>
                </b-tab>
                <b-tab title="Spotify">
                    <h5>Spotify Settings</h5>
                </b-tab>
                <b-tab title="Discord">
                    <h5>Discord Settings</h5>
                </b-tab>
            </b-tabs>
        </template>

        <template v-slot:modal-footer="{ ok, cancel }">
            <b-button variant="primary" size="sm" @click="ok">OK</b-button>
            <b-button variant="outline-primary" size="sm" @click="confApply">Apply</b-button>
            <b-button size="sm" @click="cancel">Cancel</b-button>
            <b-button variant="outline-secondary" size="sm" @click="confReset">Reset</b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import TwitchSettingsPanel from './setting_panels/twitch.vue'

@Component({
    name: 'Settings',
    components: {
        'twitch-settings': TwitchSettingsPanel
    }
})
export default class Settings extends Vue{
    @Prop({default: 'settings-modal'})
    public modalId:string

    public handleHide(event: any){
        this.$emit('settings-close')
    }

    public confReset(){
        this.$store.dispatch('clearConfigMutations')
    }

    public confApply(){
        this.$store.dispatch('applyConfigMutations')
        this.$store.dispatch('clearConfigMutations')
    }

    get settings():object{
        return this.$store.getters.editingConfig
    }

    set settings(val: object){
        this.$store.dispatch('putConfigMutation', val)
    }
}
</script>

<style lang="scss" scoped>
</style>
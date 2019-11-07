<template>
    <b-modal 
        :id="modalId" title="Settings"
        @ok="confApply" @cancel="confReset" @hide="handleHide"
        body-bg-variant="dark" header-bg-variant="dark" footer-bg-variant="dark"
        body-text-variant="light" header-text-variant="light" footer-text-variant="light">
        <template v-slot:default>
            <b-tabs justified content-class="mt-3">
                <b-tab :title-link-class="['bg-dark','text-light']" title="General" active>
                    <h5>General</h5>
                    <general-settings v-model="settings"/>
                </b-tab>
                <b-tab :title-link-class="['bg-dark','text-light']" title="Twitch">
                    <h5>Twitch Settings</h5>
                    <twitch-settings v-model="settings"/>
                </b-tab>
                <b-tab :title-link-class="['bg-dark','text-light']" title="Spotify">
                    <h5>Spotify Settings</h5>
                </b-tab>
                <b-tab :title-link-class="['bg-dark','text-light']" title="Discord">
                    <h5>Discord Settings</h5>
                </b-tab>
            </b-tabs>
        </template>

        <template v-slot:modal-footer="{ ok, cancel }">
            <b-button :id="scoped('ok-button')" variant="primary" size="sm" @click="ok">OK</b-button>
            <b-button :id="scoped('apply-button')" variant="outline-primary" size="sm" @click="confApply">Apply</b-button>
            <b-button :id="scoped('cancel-button')" size="sm" @click="cancel">Cancel</b-button>
            <b-button :id="scoped('reset-button')" variant="outline-secondary" size="sm" @click="confReset">Reset</b-button>

            <b-popover :target="scoped('ok-button')" triggers="hover" placement="top">
                Apply settings and close the settings window.
            </b-popover>
            <b-popover :target="scoped('apply-button')" triggers="hover" placement="top">
                Apply settings but don't close the settings window.
            </b-popover>
            <b-popover :target="scoped('cancel-button')" triggers="hover" placement="top">
                Cancel settings changes. Rollback and close the settings window
            </b-popover>
            <b-popover :target="scoped('reset-button')" triggers="hover" placement="top">
                Rollback to current settings but don't close the settings window
            </b-popover>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import BackendConnection from '../remote/websocket'
import _ from 'lodash'
import CustomScopeMixin from '../mixins/custom_scope_mixin'

import TwitchSettingsPanel from './setting_panels/twitch.vue'
import GeneralSettingsPanel from './setting_panels/general.vue'

@Component({
    name: 'Settings',
    components: {
        'twitch-settings': TwitchSettingsPanel,
        'general-settings': GeneralSettingsPanel
    }
})
export default class Settings extends Mixins(CustomScopeMixin){
    @Prop({default: 'settings-modal'})
    public modalId:string
    @Prop()
    public connection:BackendConnection

    public mutateConfigCache:object = {}

    public handleHide(event: any){
        this.$emit('settings-close')
    }

    public confReset(){
        this.mutateConfigCache = {}
    }

    public confApply(){
        if(this.connection.open && !_.isEmpty(this.mutateConfigCache)){
            this.connection.sendCommand('mutate_config', this.mutateConfigCache)
        }
        this.$store.dispatch('applyConfigMutations', this.mutateConfigCache)
        this.mutateConfigCache = {}
    }

    get settings():object{
        return _.defaultsDeep({}, this.mutateConfigCache, this.$store.state.config)
    }

    set settings(val: object){
        this.mutateConfigCache = _.defaultsDeep({}, val, this.mutateConfigCache)
    }
}
</script>

<style lang="scss" scoped>
</style>
<template>
    <div>
        <b-form-group>
        <b-form-checkbox :checked="settings.logins.twitch.enabled" @input="updateSettings($event, path='logins.twitch.enabled')" switch>Enable Twitch Login</b-form-checkbox>
        <b-button pill size="sm" href="https://twitchapps.com/tmi/" rel="noopener noreferrer" target="_blank">Get OAuth Token [Don't show this publicly!]</b-button>
        </b-form-group>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({
    name: 'twitch-settings'
})
export default class TwitchSettingsPanel extends Vue{
    @Prop()
    public value:object

    get settings() : object{
        return Object.assign({
            logins: {
                twitch: {
                    enabled : false
                }
            }
        }, this.value)
    }

    updateSettings(value: any, path: string): void{
        this.$emit('input', _.update({}, path, () => value))
    }
}
</script>
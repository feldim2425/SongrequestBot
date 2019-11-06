<template>
    <div>
        <b-form-checkbox :checked="settings.logins.twitch.enabled" @input="updateSettings($event, path='logins.twitch.enabled')" switch>Enable Twitch Login</b-form-checkbox>
        <br/>
        <b-card bg-variant="secondary">
            <b-form-group label="OAuthToken" :label-for="scoped('input-oauth')">
                <b-form-input :id="scoped('input-oauth')" type="password"></b-form-input>
            </b-form-group>
            <b-button pill variant="light" size="sm" href="https://twitchapps.com/tmi/" rel="noopener noreferrer" target="_blank">Get OAuth Token [Don't show this publicly!]</b-button>
            <b-form-group label="Username" :label-for="scoped('input-user')">
                <b-form-input :id="scoped('input-user')" type="text"></b-form-input>
            </b-form-group>
        </b-card>
        <b-card bg-variant="secondary">
            <b-form-group label="Channel" :label-for="scoped('input-channel')">
                <b-form-input :id="scoped('input-channel')" type="text"></b-form-input>
            </b-form-group>
        </b-card>

        <b-popover :target="scoped('input-oauth')" triggers="hover" placement="top">
            <template v-slot:title>OAuth Token</template>
            The twitch oauth token. You can click it by the button below but don't open it publicly.
        </b-popover>
        <b-popover :target="scoped('input-user')" triggers="hover" placement="top">
            <template v-slot:title>Username</template>
            Username the bot uses. It has to be the username matching the account for the OAuth token.
        </b-popover>
        <b-popover :target="scoped('input-channel')" triggers="hover" placement="top">
            <template v-slot:title>Twitch channel</template>
            Twitch channel where the bot should join.
        </b-popover>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CustomScopeMixin from '../../mixins/custom_scope_mixin';

@Component({
    name: 'twitch-settings'
})
export default class TwitchSettingsPanel extends Mixins(CustomScopeMixin){
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
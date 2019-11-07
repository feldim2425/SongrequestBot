<template>
    <div>
        <b-card bg-variant="secondary">
            <b-form-group label="Select Playback">
                <b-form-radio :checked="settings.misc.playback" @change="updateSettings($event, path='misc.playback')" value="native">Serverside playback</b-form-radio>
                <b-form-radio :checked="settings.misc.playback" @change="updateSettings($event, path='misc.playback')" value="voicechat">Discord voicechat</b-form-radio>
                <b-form-radio :checked="settings.misc.playback" @change="updateSettings($event, path='misc.playback')" value="webstream">HTTP Audio stream</b-form-radio>
                <span v-if="settings.misc.playback=='webstream'">HTTP Stream: <a class="media-link" :href="streamURL" rel="noopener noreferrer" target="_blank">{{streamURL}}</a></span>
            </b-form-group>
        </b-card>
        <b-card bg-variant="secondary">
            <b-form-group label="Announce next song">
                <b-form-checkbox :checked="settings.misc.discord_songAnnounce" @input="updateSettings($event, path='misc.discord_songAnnounce')">In Discord text channel</b-form-checkbox>
                <b-form-checkbox :checked="settings.misc.twitch_songAnnounce" @input="updateSettings($event, path='misc.twitch_songAnnounce')">In Twitch channel</b-form-checkbox>
            </b-form-group>
        </b-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CustomScopeMixin from '../../mixins/custom_scope_mixin';

@Component({
    name: 'general-settings'
})
export default class GeneralettingsPanel extends Mixins(CustomScopeMixin){
    @Prop()
    public value:object

    get settings() : object{
        return Object.assign({            
            misc: {
                playback: 'native',
                discord_songAnnounce: false,
                twitch_songAnnounce: false
            }
        }, this.value)
    }

    updateSettings(value: any, path: string): void{
        this.$emit('input', _.update({}, path, () => value)) 
    }

    get streamURL(): string{
        const loc = window.location
        return loc.protocol + '//' + loc.host + '/audio'
    }
}
</script>

<style lang="scss" scoped>
    .media-link {
        color: #1f1152
    }
</style>
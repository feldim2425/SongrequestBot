<template>
    <div>
        <b-card bg-variant="secondary">
            <b-form-group label="Select Playback">
                <b-form-radio :checked="settings.misc.playback" @change="updateSettings($event, path='misc.playback')" value="native">Serverside playback</b-form-radio>
                <b-form-radio :checked="settings.misc.playback" @change="updateSettings($event, path='misc.playback')" value="voicechat">Discord voicechat</b-form-radio>
                <b-form-radio :checked="settings.misc.playback" @change="updateSettings($event, path='misc.playback')" value="webstream">HTTP Audio stream</b-form-radio>
                <span v-if="settings.misc.playback=='webstream'">HTTP Stream: <a :href="streamURL" rel="noopener noreferrer" target="_blank">{{streamURL}}</a></span>
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
                playback: 'native'
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
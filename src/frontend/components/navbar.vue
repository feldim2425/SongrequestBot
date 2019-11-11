<template>
    <b-navbar  type="dark" variant="dark">
        <b-navbar-brand>SongRequest-Bot</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-nav-form class="mr-auto">
                <b-button size="sm" class="mr-sm-2" @click="$emit('settings-open')">Open Settings</b-button>
                <b-button size="sm" class="mr-sm-2" @click="$emit('logout')">Logout</b-button>
            </b-nav-form>
            <b-nav-form class="ml-auto">
                <b-button size="sm" class="mr-sm-2" @click="$emit('message-open')">Messages: <b-badge pill :variant="messageBadgeVariant">{{$store.state.messages.length}}</b-badge></b-button>
            </b-nav-form>
        </b-collapse>
    </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import _ from 'lodash'
import { messageTypeToBootstrapVariant, getMostImportantType } from '../remote/messages'
import { MessageType } from '~common/remote/message'

@Component({
    name: 'NavBar'
})
export default class NavBar extends Vue{

    public get messageBadgeVariant(): string{
        const type = getMostImportantType(this.$store.state.messages)
        return _.isNil(type) ? "dark" : messageTypeToBootstrapVariant(type)
    }
}
</script>

<style lang="scss" scoped>
    
</style>
<template>
    <div>
        <b-modal :id="modalId" title="Events" hide-footer
            body-bg-variant="dark" header-bg-variant="dark" footer-bg-variant="dark"
            body-text-variant="light" header-text-variant="light" footer-text-variant="light">
            <b-list-group>
                <b-list-group-item v-for="message in $store.state.messages" :key="message.id" :variant="toVariant(message)">
                    <h2 class="card-title">{{message.title}}</h2>
                    {{message.message}}
                </b-list-group-item>
            </b-list-group>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CustomScopeMixin from '../mixins/custom_scope_mixin'
import {messageTypeToBootstrapVariant} from '../remote/messages'
import {Message} from '~common/remote/message'

@Component({
    name: 'info-panel'
})
export default class InfoPanel extends Mixins(CustomScopeMixin) {

    @Prop()
    public modalId: string

    public toVariant(message: Message){
        return messageTypeToBootstrapVariant(message.type)
    }
}
</script>

<style lang="scss" scoped>
    .card-title {
        font-size: 1.1em;
        font-style: italic;
        text-decoration: underline;
    }
</style>
<template>
    <div>
        <b-modal :id="modalId" title="Events" hide-footer
            body-bg-variant="dark" header-bg-variant="dark" footer-bg-variant="dark"
            body-text-variant="light" header-text-variant="light" footer-text-variant="light">
            <b-list-group>

            </b-list-group>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CustomScopeMixin from '../mixins/custom_scope_mixin';

@Component({
    name: 'info-panel'
})
export default class InfoPanel extends Mixins(CustomScopeMixin) {

    @Prop()
    public modalId: string
}
</script>
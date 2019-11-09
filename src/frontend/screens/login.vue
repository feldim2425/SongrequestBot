<template>
    <div>
        <b-modal :visible="!loggedon"  title="Login required" @hide="cancelEvent" @ok="submit" ok-only>
            <b-form @submit="submitForm">
                <b-form-group label="Admin password" :label-for="scoped('input-password')">
                    <input :id="scoped('input-password')" v-model="password" type="password" class="form-control"/>
                </b-form-group>
            </b-form>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import CustomScopeMixin from '../mixins/custom_scope_mixin';

@Component({
    name: 'login-panel'
})
export default class LoginPanel extends Mixins(CustomScopeMixin) {

    @Prop({default: false})
    public loggedon: boolean

    public password = ''

    public submitForm(event: Event){
        event.preventDefault()
        this.submit()
    }

    public submit(){
        this.$emit('login', this.password)
        this.password = ''
    }

    public cancelEvent(event: any){
        if(!this.loggedon){
            event.preventDefault()
        }
    }
}
</script>
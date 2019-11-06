import Vue from 'vue';
import { Component, Inject, Provide } from 'vue-property-decorator'
import uuid from 'uuid/v4'

@Component
export default class CustomScopeMixin extends Vue {
    
    public customScopeMixin_uniId = uuid()

    public scoped(id: string) : string{
        return `id-${this.customScopeMixin_uniId}-${id}`
    }
}
<template>
    <nav class='navigation'>
        <ul>
                <li><b-button @click="$emit('settings-open')">Open Settings</b-button></li>
                <li><b-button @click="$emit('logout')">Logout</b-button></li>
        </ul>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
    name: 'NavBar'
})
export default class NavBar extends Vue{

}
</script>

<style lang="scss" scoped>
    @import '../style/utils';

    .navigation {
        @include linear-gradient(to bottom, #273950 0%, #0c1015 50%, #273950 100%);
        height: 50px;
        margin: 0;
        position: relative;

        ul {
            list-style-type: none;
            padding: 1em;
            margin: auto;
            overflow: hidden;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }

        li {
            float: left;
            margin-left: 4px
        }
    }
</style>
<template>
    <nav class='navigation'>
        <ul>
            <li><b-button>Open Settings</b-button></li>
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
        @include linear-gradient(to bottom, rgba(102,102,102,1) 0%, rgba(61,60,61,1) 50%, rgba(107,107,107,1) 100%);
        height: 50px;
        padding: 0;

        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
        }

        li {
            float: left;
            height: 100%;
            a {
                padding: 1em 1em;
                display: block;
                color: white;
                text-align: center;
                text-decoration: none;
            }
        }
    }
</style>
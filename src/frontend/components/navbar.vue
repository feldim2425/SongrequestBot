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
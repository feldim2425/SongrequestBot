<template>
    <div>
        <SongList/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SongList from '../components/songlist.vue'
import {Component} from 'vue-property-decorator'

@Component({
    name: 'StatusPanel',
    components: {SongList}
})
export default class StatusPanel extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
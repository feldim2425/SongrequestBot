<template>
    <div>
        <b-table striped bordered small dark :fields="fields" :items="songs">
            <template v-slot:cell(deleteButton)="row">
                <b-button size="sm" @click="deleteSong(row.item)" class="mr-2">
                    Delete
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
import Song, { Source } from '../remote/song';

@Component({name: 'SongList'})
export default class SongList extends Vue {

    public fields: object|string[] = [
        {key: 'name', label: 'Song'},
        {key: 'source_readable', label: 'Playback Source'},
        {key: 'requester', label: 'Requested from'},
        {key: 'deleteButton', label: 'Delete'},
    ]

    get songs(): Song[]{
        return this.$store.state.songlist
    }

    deleteSong(row: Song): void{
        console.log(row)
    }
}
</script>

<style lang="scss" scoped>
</style>
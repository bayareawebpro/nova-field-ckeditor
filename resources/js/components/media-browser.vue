<script>
    /** @var Nova */
    import modal from './modal'
    import loading from './loading'
    import spinner from './../assets/spinner'
    import interactsWithResources from "./mixins/interactsWithResources"

    export default {
        name: "MediaBrowser",
        components: {loading, modal},
        mixins: [interactsWithResources],
        props: {
            fieldName: {default: () => 'content'},
            multiple: {default: () => true},
        },
        data: () => ({
            items: [],
            selected: [],
            isVisible: false,
            isLoading: false,
            isUploading: false,
            searchTerm: '',
            orderBy: 'id',
            sort: 'desc',
            perPage: 100,
            page: 1,
        }),
        computed: {
            event() {
                return `ckeditor:media:${this.fieldName}`
            }
        },
        methods: {
            /**
             * Fetch Resource
             * @param page Number
             */
            async fetch(page = 0) {
                if (this.isLoading) return;
                this.isLoading = true
                const newPage = (page ? page : this.page + 1)
                return await this.fetchResourceCollection('media', {
                    orderByDirection: this.sort,
                    search: this.searchTerm,
                    orderBy: this.orderBy,
                    perPage: this.perPage,
                    page: newPage,
                })
                .then((entities) => {
                    if(entities.length){
                        this.items = this.page > 1 ? this.items.concat(entities) : entities
                        this.page = newPage
                    }
                })
                .finally(() => {
                    this.isLoading = false
                })
            },
            /**
             * Handle Dropped File Uploads
             * @param dataTransfer {DataTransfer}
             */
            handleUploads({dataTransfer}) {
                this.isUploading = true
                const ids = []
                const requests = ([...dataTransfer.files]).map(file => {
                    return this.uploadResource('media', {file}).then((item) => {
                        this.$toasted.show(this.__('Complete: :file',item), {
                            type: 'success'
                        })
                        ids.push(item.id)
                    })
                })
                Promise.all(requests)
                    .then(() => this.fetch(1))
                    .then(()=>this.items
                        .filter(({id})=>ids.includes(id))
                        .forEach(this.select.bind(this))
                    )
                    .finally(() =>  this.isUploading = false)
            },

            /**
             * Emit Write Event to Field Component
             */
            insert() {
                Nova.$emit(`${this.event}:write`, this.multiple ? this.selected : this.selected[0])
                this.selected = []
                this.isVisible = false
            },

            /**
             * Select One or Many Items
             * @param item
             * @return {*[]}
             */
            select(item) {
                if (this.multiple) {
                    if (this.isSelected(item)) {
                        this.deselect(item)
                    }else{
                        this.selected.push(item)
                    }
                } else {
                    this.selected = [item]
                }
            },
            deselect(item){
                this.selected = this.selected.filter(entry => entry.id !== item.id)
            },
            /**
             * Is the item selected?
             * @param item
             * @return {boolean}
             */
            isSelected(item) {
                return this.selected.find((entry)=>item.id ===entry.id)
            },
            /**
             * Handle Infinite Scrolling
             * @param target EventTarget
             */
            onScroll({target}) {
                if ((target.scrollHeight - target.scrollTop) ===  target.clientHeight) {
                    this.fetch()
                }
            },
            /**
             * Show the Modal
             */
            show() {
                this.fetch(1).then(() => this.isVisible = true)
            },
        },
        created() {
            this.$options.spinner = spinner
            Nova.$on(`${this.event}`, this.show)
        },
        beforeDestroy() {
            Nova.$off(`${this.event}`, this.show)
        }
    }
</script>
<template>
    <modal
        ref="modal"
        title="Media Library"
        v-model="isVisible">
        <template v-slot:header>
            <div class="ml-6">
                <input
                    type="search"
                    v-model="searchTerm"
                    placeholder="Search..."
                    @keydown.enter="fetch(1)"
                    class="form-control form-input form-input-bordered"
                />
                <select
                    v-model="orderBy"
                    @change="fetch(1)"
                    class="form-control form-input form-input-bordered">
                    <optgroup label="Order By">
                        <option value="id">ID</option>
                        <option value="file">FileName</option>
                        <option value="hash">Hash</option>
                        <option value="width">Width</option>
                        <option value="height">Height</option>
                        <option value="file">FileSize</option>
                    </optgroup>
                </select>
                <select
                    v-model="sort"
                    @change="fetch(1)"
                    class="form-control form-input form-input-bordered">
                    <optgroup label="Sort">
                        <option value="asc">Asc.</option>
                        <option value="desc">Desc.</option>
                    </optgroup>
                </select>
            </div>
        </template>

        <transition name="mediaLoading" mode="out-in">
            <template v-if="isUploading">
                <div class="flex flex-col h-full text-white content-center justify-center text-center">
                    <div class="relative" style="height: 64px">
                        <loading/>
                    </div>
                    <p>Uploading...</p>
                </div>
            </template>
            <div
                v-else
                ref="scrollable"
                @scroll="onScroll"
                @dragover.prevent=""
                @drop.prevent="handleUploads"
                class="h-full w-full overflow-y-scroll">
                <transition-group tag="div" name="mediaLoading" class="flex flex-row flex-wrap justify-center">
                    <div
                        @click="select(item)"
                        :key="item.id" v-for="item in items"
                        class="text-center p-2 cursor-pointer inline-flex">
                        <v-lazy-image
                            :key="item.id"
                            :src="item.url"
                            style="max-height: 100px"
                            :src-placeholder="$options.spinner"
                            :class="{'media-image-selected': isSelected(item)}"
                            class="media-image rounded shadow"
                        />
                    </div>
                </transition-group>
            </div>
        </transition>
        <template v-slot:footer>
            <div class="flex p-2">
                <div>
                    <button
                        @click.prevent="insert"
                        :disabled="!selected.length"
                        class="btn btn-default btn-primary items-center relative mr-3">
                        {{ selected.length < 2 ? 'Choose Image' : `Insert ${selected.length} Images` }}
                    </button>
                </div>
                <div class="flex-grow text-white self-center" v-if="selected.length > 1">
                    {{ selected.length}} Items Selected for Document
                </div>
            </div>
        </template>
    </modal>
</template>
<style lang="sass" scoped>
    .media-image
        border: 3px solid transparent
        transition: all 120ms ease-in-out

    .media-image:hover
        transform: scale(1.06)

    .media-image.media-image-selected
        outline-color: aqua
        border: 3px solid aqua !important

    .v-lazy-image
        opacity: 0
        transition: all 120ms ease-in-out !important

    .v-lazy-image-loaded
        opacity: 1

    .mediaLoading-enter,
    .mediaLoading-leave-active
        opacity: 0
        transition: all 120ms ease-in-out !important

    .mediaItem-enter,
    .mediaItem-leave-active,
    .mediaItem-enter *,
    .mediaItem-leave-active *
        opacity: 0
        transition: all 300ms ease-in-out !important
        transform: scale(0)
</style>

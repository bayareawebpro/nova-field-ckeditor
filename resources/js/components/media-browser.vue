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
            page: 1,
            perPage: 100,
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
            async fetch(page = 1) {
                if (this.isLoading) return;
                this.isLoading = true
                this.page = (page ? page : this.page + 1)
                return await this.fetchResourceCollection('media', {
                    search: this.searchTerm,
                    orderBy: this.orderBy,
                    orderByDirection: this.sort,
                    perPage: 100,
                    page: this.page,
                })
                .then((entities) => {
                    this.items = this.page > 1 ? this.items.concat(entities) : entities
                })
                .finally(() => {
                    setTimeout(() => this.isLoading = false, 300)
                })
            },
            /**
             * Handle Dropped File Uploads
             * @param dataTransfer {DataTransfer}
             */
            handleUploads({DataTransfer}) {
                this.isUploading = true
                const requests = ([...DataTransfer.files]).map(file => {
                    return this.uploadResource('media', {file}).then(() => {
                        this.$toasted.show(this.__('Complete: :name',file), {
                            type: 'success'
                        })
                    })
                })
                Promise.all(requests)
                    .then(() => this.fetch(1))
                    .finally(() => this.isUploading = false)
            },
            /**
             * Emit Write Event to Field Component
             */
            insert() {
                Nova.$emit(`${this.event}:write`, this.multiple ? this.selected : this.selected[0])
                this.isVisible = false
                this.selected = []
            },
            /**
             * Select One or Many Items
             * @param item
             * @return {*[]}
             */
            select(item) {
                if (this.multiple) {
                    if (this.isSelected(item)) {
                        return this.selected = this.selected.filter(entry => entry.id !== item.id)
                    }
                    this.selected.push(item)
                } else {
                    this.selected = [item]
                }
            },
            /**
             * Is the item selected?
             * @param item
             * @return {boolean}
             */
            isSelected(item) {
                return this.selected.indexOf(item) > -1
            },
            /**
             * Handle Infinite Scrolling
             * @param target {Event}
             */
            onScroll({target}) {
                const position = (target.scrollTop + target.offsetHeight)
                if (position > (target.scrollHeight - 3)) {
                    this.fetch()
                }
            },
            /**
             * Show the Modal
             */
            show() {
                if (!this.items.length) {
                    this.fetch(1).then(() => this.isVisible = true)
                } else {
                    this.isVisible = true
                }
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
                    @keydown.enter="fetch"
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
                <div class="flex flex-row flex-wrap bg-black h-full text-white content-center justify-center">
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
                class="bg-black h-full overflow-y-scroll">
                <transition-group tag="div" name="mediaLoading" class="flex flex-row flex-wrap w-full h-full">
                    <div :key="item.id" v-for="item in items" class="w-1/6">
                        <div
                            @click="select(item)"
                            class="text-center p-2 cursor-pointer">
                            <v-lazy-image
                                :key="item.id"
                                :src="item.url"
                                style="height: 100px"
                                :src-placeholder="$options.spinner"
                                :class="{'media-image-selected': isSelected(item)}"
                                class="media-image rounded shadow"
                            />
                        </div>
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

<script>
    /** @var Nova */
    import modal from './modal'
    import loading from './loading'
    import interactsWithResources from "./mixins/interactsWithResources"
    export default {
        name: "MediaBrowser",
        components: {loading, modal},
        mixins: [interactsWithResources],
        props: {
            fieldKey: {default: () => 'content'},
            multiple: {default: () => true},
        },
        data(){
            return {
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
            }
        },
        computed: {
            event() {
                return `ckeditor:media:${this.fieldKey}`
            }
        },
        methods: {
            async fetch(page = 0) {
                if (this.isLoading) return;

                this.isLoading = true
                const newPage = (page ? page : this.page + 1)

                return await this.fetchResourceCollection('media', {
                    orderByDirection: this.sort,
                    search: this.searchTerm,
                    orderBy: this.orderBy,
                    perPage: this.perPage,
                    ckeditor: 'media',
                    page: newPage,
                })
                .then((entities) => {
                    this.items = newPage > 1 ? this.items.concat(entities) : entities
                    if(entities.length){
                        this.page = newPage
                    }
                })
                .finally(() => {
                    this.isLoading = false
                })
            },
            handleUploads({dataTransfer}) {
                if(this.isUploading) return;
                this.isUploading = true
                const uploads = []
                const requests = ([...dataTransfer.files]).map(file => {
                    return this.uploadResource('media', {file}).then((item) => {
                        Nova.success(this.__('Uploaded: :file',item))
                        uploads.push(item)
                    })
                })
                Promise.all(requests).then(() => {
                    this.isUploading = false
                    this.searchTerm = ''
                    this.orderBy = 'id'
                    this.sort = 'desc'
                    this.fetch(1)
                })
            },
            insert() {
                Nova.$emit(`${this.event}:write`, this.multiple ? this.selected : this.selected[0])
                this.isVisible = false
                this.selected = []
            },
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
            isSelected(item) {
                return this.selected.find((entry)=>item.id === entry.id)
            },
            onScroll({target}) {
                if ((target.scrollHeight - target.scrollTop) <= target.clientHeight + 200) {
                    this.fetch()
                }
            },
            show() {
                this.isVisible = true
                this.fetch(1)
            },
            close(fieldKey) {
                if(fieldKey !== this.fieldKey){
                    this.isVisible = false
                }
            },
        },
        created() {
            Nova.$on(this.event, this.show)
            Nova.$on(`ckeditor:focused`, this.close)
        },
        beforeDestroy() {
            Nova.$off(this.event, this.show)
            Nova.$off(`ckeditor:focused`, this.close)
        }
    }
</script>
<template>
    <modal
        ref="modal"
        title="Media"
        v-model="isVisible">
        <template #header>
            <div class="media-flex-row">
                <div class="media-flex-row-item">
                    <input
                        type="search"
                        v-model="searchTerm"
                        placeholder="Search..."
                        @keydown.enter.prevent="fetch(1)"
                        class="form-control form-input form-input-bordered"
                    />
                </div>
                <div class="media-flex-row-item hidden lg:block">
                    <select
                        v-model="orderBy"
                        @change="fetch(1)"
                        class="form-control form-input form-input-bordered">
                        <optgroup label="Order By">
                            <option value="id">ID</option>
                            <option value="file">Name</option>
                            <option value="hash">Hash</option>
                            <option value="width">Width</option>
                            <option value="height">Height</option>
                            <option value="size">Size</option>
                        </optgroup>
                    </select>
                </div>
                <div class="media-flex-row-item hidden lg:block">
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
                <div class="media-flex-row-item" v-if="isLoading">
                    <div class="relative" style="height: 24px">
                        <loading/>
                    </div>
                </div>
            </div>
        </template>

        <transition name="mediaLoading" mode="out-in">
            <div v-if="isUploading" class="media-flex-fill text-gray-500 dark:text-gray-400">
                <div>
                    <div class="relative" style="height: 64px">
                        <loading/>
                    </div>
                    <p>Optimizing & Uploading to Storage...</p>
                </div>
            </div>
            <div v-else-if="items.length"
                 class="media-scroll"
                 ref="scrollable"
                 @scroll="onScroll"
                 @dragover.prevent=""
                 @drop.prevent="handleUploads">
                <div class="media-flex-grid">
                    <div
                        :key="item.id" v-for="item in items" @click="select(item)"
                        :class="{ 'media-image': true, 'media-image-selected': isSelected(item)}"
                        :style="{backgroundImage: `url(${item.url})`}"
                    />
                </div>
            </div>
            <div v-else
                 @dragover.prevent=""
                 @drop.prevent="handleUploads"
                 class="media-flex-fill">
                <p>{{ isLoading ? 'Loading...' : 'No Results.'}}</p>
            </div>
        </transition>

        <template #footer>
            <div class="media-flex-row">
                <div class="media-flex-row-item">
                    <button
                        @click.prevent="insert"
                        :disabled="!selected.length"
                        class="shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring inline-flex items-center justify-center h-9 px-3 shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900">
                        {{ selected.length < 2 ? 'Choose Image' : `Insert ${selected.length} Images` }}
                    </button>
                </div>
                <div class="media-flex-row-item" v-if="selected.length > 1">
                    {{ selected.length}} Items Selected
                </div>
            </div>
        </template>
    </modal>
</template>
<style lang="sass" scoped>

    .media-flex-row
        display: flex
        flex-direction: row
        align-items: center

    .media-flex-row-item
        flex-shrink: 1
        padding: 5px

    .media-flex-fill
        display: flex
        flex-direction: row
        flex-wrap: nowrap
        justify-content: center
        align-items: center
        min-height: 100%
        min-width: 100%
        height: 100%
        width: 100%

    .media-flex-grid
        display: flex
        flex-direction: row
        flex-wrap: wrap
        justify-content: center
        align-items: center

    .media-scroll
        overflow-y: auto
        min-height: 100%
        min-width: 100%
        height: 100%
        width: 100%

    .media-image
        background-size: cover
        background-repeat: no-repeat
        background-position: center center
        transition: all 120ms ease-in-out
        border: 3px solid transparent
        cursor: pointer
        height: 180px
        width: 180px
        margin: 5px
        opacity: 1

    .media-image:hover
        transform: scale(1.06)

    .media-image.media-image-selected
        border: 3px solid aqua
</style>

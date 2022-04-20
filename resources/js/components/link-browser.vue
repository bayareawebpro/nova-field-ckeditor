<script>
    /** @var Nova */
    import modal from './modal'
    import loading from './loading'
    import interactsWithResources from "./mixins/interactsWithResources"
    export default {
        name: "link-browser",
        mixins:[interactsWithResources],
        components: {loading, modal},
        props: {fieldKey: {default: ()=>'content'}},
        data() {
            return {
                searchTerm: '',
                isVisible: false,
                isLoading: false,
                items: [],
            }
        },
        computed:{
            event(){
                return `ckeditor:link:${this.fieldKey}`
            },
        },
        methods: {
            /**
             * HTTP Request.
             * @return void
             */
            async fetch() {
                if(this.isLoading) return;
                this.isLoading = true
                this.items = []
                return await this.fetchResourceCollection('pages', {
                        search: this.searchTerm,
                        orderByDirection: 'asc',
                        orderBy: 'title',
                        perPage: 80,
                        ckeditor: 'links',
                    })
                    .then((items) => {
                        this.items = items
                    })
                    .catch((error) => {
                        Nova.error(this.__(':message',{message:error}))
                    })
                    .finally(()=>{
                        setTimeout(()=> this.isLoading = false, 300)
                    })
            },
            /**
             * Insert the Item into the Editor's Content.
             * @return void
             */
            insert(item) {
                Nova.$emit(`${this.event}:write`, item)
            },
            /**
             * Toggle the Modal Window & Initialize the State.
             * @return void
             */
            open() {
                this.isVisible = true
                this.$nextTick(()=>this.$refs.input.focus())
            },
            /**
             * Close the Modal
             * If the user focuses another instance of the editor, close the modal.
             */
            close(fieldKey) {
                if(fieldKey !== this.fieldKey){
                    this.isVisible = false
                }
            },
        },
        created() {
            Nova.$on(this.event, this.open)
            Nova.$on(`ckeditor:focused`, this.close)
        },
        beforeDestroy() {
            Nova.$off(this.event, this.open)
            Nova.$off(`ckeditor:focused`, this.close)
        },
    }
</script>
<template>
    <modal
        ref="modal"
        v-model="isVisible"
        :scrollLock="false"
        style="max-width: 220px; margin-right: auto">
        <template #header>
            <div class="flex">
                <input
                    ref="input"
                    type="search"
                    style="max-width: 155px;"
                    placeholder="Search Page Links..."
                    v-model="searchTerm"
                    @keydown.enter.prevent="fetch"
                    class="form-control form-input form-input-bordered"/>
            </div>
        </template>
        <div class="editor-links-collection text-gray-500 dark:text-gray-400">
            <template v-if="isLoading">
                <div class="relative" style="height: 32px">
                    <loading/>
                </div>
                <p class="text-center">Loading...</p>
            </template>
            <template v-else-if="items.length">
                <div
                    :key="item.id"
                    v-for="(item) in items"
                    @click.prevent="insert(item)"
                    class="editor-links-item">
                    {{ item.title }}
                </div>
            </template>
            <template v-else>
                <div class="editor-links-no-results">
                    No Results
                </div>
            </template>
        </div>
    </modal>
</template>
<style lang="sass">
    .editor-links-collection
        padding: 5px
    .editor-links-item,
    .editor-links-no-results
        font-weight: bold
        padding: 5px
        cursor: pointer

    .editor-links-no-results
        cursor: default
</style>

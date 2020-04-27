<script>
    /** @var Nova */
    import modal from './modal'
    import loading from './loading'
    import interactsWithResources from "./mixins/interactsWithResources"
    export default {
        name: "link-browser",
        mixins:[interactsWithResources],
        components: {loading, modal},
        props: {fieldName: {default: ()=>'content'}},
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
                return `ckeditor:link:${this.fieldName}`
            },
            query(){
                return `orderBy=title&orderByDirection=asc&perPage=200`
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
                return await this.fetchResourceCollection('pages', {
                        search: this.searchTerm,
                    })
                    .then((items) => {
                        this.items = items
                    })
                    .catch((error) => {
                        this.$toasted.show(this.__(':message',{message:error.toString()}),{ type: 'error' })
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
            toggle() {
                this.isVisible = !this.isVisible
                this.fetch()
            },
        },
        created() {
            Nova.$on(this.event, this.toggle)
            //this.toggle()
        },
        beforeDestroy() {
            Nova.$off(this.event, this.toggle)
        },
    }
</script>
<template>
    <modal
        ref="modal"
        class="shadow-lg"
        v-model="isVisible"
        :scrollLock="false"
        style="max-width: 220px; margin-right: auto">
        <template slot="header">
            <div class="flex">
                <input
                    type="search"
                    style="max-width: 155px;"
                    placeholder="Search Links..."
                    v-model="searchTerm"
                    @keydown.enter.prevent="fetch"
                    class="shrink-1 border-primary-dark p-2 rounded"/>
            </div>
        </template>
        <div v-if="items.length">
            <div
                :key="item.id"
                v-for="(item) in items"
                @click.prevent="insert(item)"
                class="m-2 pb-2 text-white font-bold text-sm hover:text-primary cursor-pointer">
                {{ item.title }}
            </div>
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center">
            <template v-if="isLoading">
                <div>
                    <div class="relative" style="height: 64px"><loading/></div>
                    <p class="text-white text-center m-0">Loading...</p>
                </div>
            </template>
            <template v-else>
                <p class="text-white text-center m-0">No Results.</p>
            </template>
        </div>
    </modal>
</template>
<style lang="sass">
    .route-link.selected
        color: yellow
</style>

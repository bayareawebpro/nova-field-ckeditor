<script>
    import modal from './modal'
    export default {
        name: "snippet-browser",
        components: {modal},
        props: {
            fieldName: {default: () => 'content'},
            snippets: {default: () => ([])},
        },
        data: () => ({
            isVisible: false,
            selected: null,
        }),
        computed: {
            event() {
                return `ckeditor:snippets:${this.fieldName}`
            }
        },
        methods: {
            show() {
                this.isVisible = true
                const [{html}] = this.snippets
                this.selected = html
            },
            insert(snippet) {
                Nova.$emit(`${this.event}:write`, snippet)
                this.isVisible = false
            },
        },
        created() {
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
        title="Snippets"
        v-model="isVisible">
        <div class="p-6 bg-white h-full">
            <div class="flex">
                <div class="w-1/5">
                    <div
                        v-for="(snippet) in snippets"
                        class="snippet border-l-4 p-3 cursor-pointer"
                        :class="{'snippet-selected': selected === snippet.html}">
                        <h4 @click="selected = snippet.html">
                            {{snippet.name}}
                        </h4>
                    </div>
                </div>
                <div class="w-4/5">
                    <div v-html="selected" class="snippet-content"/>
                </div>
            </div>
        </div>
        <template v-slot:footer>
            <div class="flex p-2">
                <div>
                    <button
                        :disabled="!selected"
                        @click.prevent="insert(selected)"
                        class="btn btn-default btn-primary items-center relative mr-3">
                        Insert Snippet
                    </button>
                </div>
            </div>
        </template>
    </modal>
</template>
<style lang="sass">
    .snippet
        border-color: gray
        &:hover:not(.snippet-selected)
            border-color: #5f5f5f
    .snippet-content
        border-color: #999999
    .snippet-selected
        border-color: #0950a7

</style>

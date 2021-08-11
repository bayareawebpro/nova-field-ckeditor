<script>
    import CkEditor from '../ckeditor/ckeditor'
    import SnippetBrowser from "./snippet-browser"
    import MediaBrowser from "./media-browser"
    import LinkBrowser from "./link-browser"
    import {FormField, HandlesValidationErrors} from 'laravel-nova'
    export default {
        components: {SnippetBrowser, LinkBrowser,MediaBrowser},
        mixins: [FormField, HandlesValidationErrors],
        props: ['resourceName', 'resourceId', 'field','toolbar'],
        methods: {
            setInitialValue() {
                this.value = this.field.value || ''
            },
            fill(formData) {
                formData.append(this.field.attribute, this.value || '')
            },
            handleChange(value) {
                this.value = value
            },
            handleEditorEvents(event, data){
                if (['Tab', '/'].includes(data.key) || [191, 9].includes(data.keyCode)) {
                    data.stopPropagation()
                }
            },
            handleEditorSync(){
                this.handleChange(this.$options.editor.getData())
            }
        },
        mounted() {
            CkEditor.create(this.$refs.editor,{
                attribute: this.field.attribute,
                linkBrowser: this.field.linkBrowser,
                mediaBrowser: this.field.mediaBrowser,
                snippetBrowser: this.field.snippetBrowser,
                toolbar:{items: this.field.toolbar}
            }).then((editor) => {
                    const {editing, model} = this.$options.editor = editor
                    //Prevent QuestionMark & Slash from triggering Nova Search.
                    editing.view.document.on('keydown', this.handleEditorEvents, {
                        priority: 'highest'
                    })
                    //Sync Model Changes to VueModel.
                    model.document.on('change', this.handleEditorSync, {
                        priority: 'lowest'
                    })
                    // Set the height of the editor when editing.
                    if(this.value && this.value.length > 1){
                        editor.ui.view.editable.element.style.height = `${this.field.height}px`;
                    }
                })
                .catch((e) => this.$toasted.show(e.toString(),{ type: 'error' }))
        },
        beforeDestroy() {
            if (this.$options.editor) {
                this.$options.editor
                    .destroy()
                    .then(() => this.$options.editor = null)
                    .catch((e) =>this.$toasted.show(e.toString(),{ type: 'error' }))
            }
        },
    }
</script>
<template>
    <default-field :field="field" :errors="errors" :full-width-content="true">
        <template slot="field">
            <textarea
                ref="editor"
                :id="field.attribute"
                :class="errorClasses"
                class="hidden"
                :value="value"
            />
            <link-browser
                :attribute="field.attribute"
            />
            <media-browser
                :attribute="field.attribute"
                :multiple="true"
            />
            <snippet-browser
                :attribute="field.attribute"
                :snippets="field.snippetBrowser"
            />
        </template>
    </default-field>
</template>
<style lang="sass">
    .ck-content.ck-editor__editable
        resize: vertical
    .ck.ck-reset.ck-editor
        .ck.ck-toolbar
            border-radius: 10px 10px 0 0
        .ck-editor__editable_inline
            border-radius: 0 0 10px 10px
            margin: 0
            padding: 0 10px
            @import "../../sass/field"
        .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused
            box-shadow: none
</style>

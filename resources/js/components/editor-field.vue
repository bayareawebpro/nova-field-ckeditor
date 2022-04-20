<script>
import {component} from '@ckeditor/ckeditor5-vue';
import {Editor} from '@bayareawebpro/ckeditor5-classic-custom'
 import MediaBrowser from "./media-browser"
import Attachments from '../ckeditor/plugins/Attachments'
import Links from '../ckeditor/plugins/Links'
import LinkBrowser from "./link-browser"
// import SnippetBrowser from "./snippet-browser"
// import Links from '../plugins/Links'
import uuid from "./mixins/HasUUID"
import {FormField, HandlesValidationErrors} from 'laravel-nova'
export default {
    mixins: [FormField, HandlesValidationErrors],
    props: ['resourceName', 'resourceId', 'field'],
    components:{
        ckeditor: component,
        MediaBrowser:MediaBrowser,
        LinkBrowser:LinkBrowser,
    },
    data(){
        return {
            editor: Editor,
            uuid: uuid(),
            editorValue:'',
            config: {
                toolbar:this.field.toolbar,
                makePlugins:{
                    ...Attachments.make((insert) => {
                        Nova.$emit(`ckeditor:focused`)
                        Nova.$emit(`ckeditor:media:${this.uuid}`)
                        Nova.$once(`ckeditor:media:${this.uuid}:write`, insert)
                    }),
                    ...Links.make((insert) => {
                        Nova.$emit(`ckeditor:focused`)
                        Nova.$emit(`ckeditor:link:${this.uuid}`)
                        Nova.$off(`ckeditor:link:${this.uuid}:write`, insert)
                        Nova.$on(`ckeditor:link:${this.uuid}:write`, insert)
                    }),
                }
            },
        }
    },
    methods: {
        setInitialValue() {
            this.value = this.field.value || ''
        },
        prefill( editor ) {
            this.editorValue = this.value;
        },
    },
    watch:{
        editorValue:{
            handler(){
                this.value = this.editorValue;
            }
        }
    },
}
</script>
<template>
    <DefaultField
        :field="field"
        :errors="errors"
        :show-help-text="showHelpText">
        <template #field>
            <ckeditor
                :editor="editor"
                :config="config"
                v-model="editorValue"
                @ready="prefill"
            />
            <MediaBrowser
                :field-key="uuid"
                :multiple="true"
            />
            <linkBrowser
                :field-key="uuid"
            />
            <snippet-browser
                :field-key="uuid"
                :snippets="field.snippetBrowser"
            />
        </template>
    </DefaultField>
</template>
<style lang="sass">
    @import "../../sass/field"
</style>

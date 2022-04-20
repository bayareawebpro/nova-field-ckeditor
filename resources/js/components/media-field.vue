<script>
import uuid from './mixins/HasUUID'
import MediaBrowser from './media-browser'
import interactsWithResources from './mixins/interactsWithResources'
import {FormField, HandlesValidationErrors} from 'laravel-nova'
export default {
    props: ['resourceName', 'resourceId', 'field'],
    mixins: [FormField, HandlesValidationErrors, interactsWithResources],
    components: {MediaBrowser},
    data(){
        return {
            preview: null,
            uuid: uuid()
        }
    },
    computed: {
        event() {
            return `ckeditor:media:${this.uuid}`
        },
    },
    methods: {
        setInitialValue() {
            if (this.field.value) {
                this.fetchResourceEntity('media', this.field.value).then(({url}) => {
                    this.preview = url
                })
            }
            this.value = (this.field.value || null)
        },
        fill(formData) {
            formData.append(this.field.attribute, this.value || '')
        },
        clearSelected() {
            this.value = null
            this.preview = null
        },
        handleChange(selected) {
            this.value = selected.id
            this.preview = selected.url
        },
        openBrowser() {
            Nova.$emit(this.event)
        },
    },
    created() {
        Nova.$on(`${this.event}:write`, this.handleChange)
    },
    beforeDestroy() {
        Nova.$off(`${this.event}:write`, this.handleChange)
    }
}
</script>
<template>
    <DefaultField :field="field" :errors="errors" :show-help-text="showHelpText">
        <template #field>
            <template v-if="preview">
                <div
                    class="shadow-md rounded mb-4 block"
                    :style="{
                        backgroundImage: `url(${preview})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        width: `${field.form_width}px`,
                        height: `${field.form_height}px`,
                        maxWidth: '100%',
                    }"
                />
            </template>
            <button
                v-if="preview"
                type="button"
                @click.prevent="clearSelected"
                class="shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring inline-flex items-center justify-center h-9 px-3 shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900">
                Remove
            </button>
            <button
                v-else
                type="button"
                @click.prevent="openBrowser"
                class="shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring inline-flex items-center justify-center h-9 px-3 shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900">
                Select
            </button>
            <p v-if="hasError" class="my-2 text-danger">
                {{ firstError }}
            </p>
            <MediaBrowser :field-key="uuid" :multiple="false"/>
        </template>
    </DefaultField>
</template>

<script>
    import IndexView from './media-index'
    export default {
        props: ['resource', 'resourceName', 'resourceId', 'field'],
        extends: IndexView,
    }
</script>
<template>
    <panel-item :field="field">
        <template slot="value">
            <v-lazy-image
                v-if="preview"
                :src="preview"
                :src-placeholder="$options.spinner"
                class="shadow-md rounded mb-3 block"
                style="width: 100%; max-height: 400px"
            />
        </template>
    </panel-item>
</template>


<script>
    export default {
        props: ['resource', 'resourceName', 'resourceId', 'field'],
    }
</script>
<template>
    <panel-item :field="field">
        <template slot="value">
            <div class="py-6 ckeditor_content">
                <excerpt
                    :content="field.value"
                    :should-show="field.shouldShow"
                    :plain-text="false"
                />
            </div>
        </template>
    </panel-item>
</template>
<style lang="sass">
    .ckeditor_content
        @import "./../../sass/figures.sass"
        @import "./../../sass/blocks.sass"
</style>


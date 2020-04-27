<script>
    export default {
        props: ['resource', 'resourceName', 'resourceId', 'field'],
    }
</script>
<template>
    <div class="py-6">
        <excerpt
            :content="field.value"
            :plain-text="false"
            :should-show="field.shouldShow"
        />
    </div>
</template>
<style lang="sass" scoped>
    @import "./../../sass/figures.sass"
    @import "./../../sass/blocks.sass"
</style>


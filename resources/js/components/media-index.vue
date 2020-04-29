<script>
    import spinner from './../assets/spinner'
    import interactsWithResources from "./mixins/interactsWithResources"
    export default {
        props: ['resourceName', 'field'],
        mixins: [interactsWithResources],
        data: ()=>({preview: null}),
        beforeCreate() {
            this.$options.spinner = spinner
        },
        created() {
            if(this.field.value){
                this.fetchResourceEntity('media',this.field.value).then(({url})=>{
                    this.preview = url
                })
            }
        },
    }
</script>
<template>
    <div>
        <v-lazy-image
            v-if="preview"
            :src="preview"
            :src-placeholder="$options.spinner"
            class="shadow-md rounded m-2 block"
            :style="{
                width: 'auto',
                height: 'auto',
                maxWidth: `${field.index_width}px`,
                maxHeight: `${field.index_height}px`
            }"
        />
    </div>
</template>

<script>
    import interactsWithResources from "./mixins/interactsWithResources"
    export default {
        props: ['resourceName', 'field'],
        mixins: [interactsWithResources],
        data: ()=>({preview: null}),
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
        <div
            v-if="preview"
            class="shadow-md rounded mb-4 block"
            :style="{
                backgroundImage: `url(${preview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                width: `${field.index_width}px`,
                height: `${field.index_height}px`
            }"
        />
    </div>
</template>

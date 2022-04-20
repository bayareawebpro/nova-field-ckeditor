<script>
import interactsWithResources from "./mixins/interactsWithResources"
    export default {
        props: ['index', 'resource', 'resourceName', 'resourceId', 'field'],
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
    <panel-item :field="field">
        <template #value>
            <div
                v-if="preview"
                class="shadow-md rounded mb-4 block"
                :style="{
                    backgroundImage: `url(${preview})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    width: `${field.detail_width}px`,
                    height: `${field.detail_height}px`,
                    maxWidth: '100%',
                }"
            />
        </template>
    </panel-item>
</template>


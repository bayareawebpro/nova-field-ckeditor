<script>
export default {
    props: {
        title: {type: String, default: null},
        modelValue: {type: Boolean, default: false},
        scrollLock: {type: Boolean, default: true},
        fullscreen: {type: Boolean, default: false},
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                if(value){
                    if(this.scrollLock){
                        document.documentElement.classList.add('modal-open')
                    }
                    document.addEventListener('keydown', this.onKeyDownEsc)
                }else{
                    if(this.scrollLock){
                        document.documentElement.classList.remove('modal-open')
                    }
                    document.removeEventListener('keydown', this.onKeyDownEsc)
                }
            }
        },
    },
    methods: {
        onKeyDownEsc(event){
            if (event.key === "Escape") {
                this.close()
            }
        },
        close(){
            this.$emit('update:modelValue',false)
        },
        hasSlot(slot) {
            return !!this.$slots[slot]
        }
    }
}
</script>
<template>
    <transition name="ckeditor-modal" mode="out-in">
        <div v-if="modelValue" role="dialog" class="ckeditor-modal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900">
            <div class="ckeditor-modal-header bg-white dark:bg-gray-800 h-14 dark:border-b dark:border-gray-700">
                <div v-if="title" class="ckeditor-modal-title">
                    <strong>{{ title }}</strong>
                </div>
                <div class="ckeditor-modal-slot">
                    <slot name="header"/>
                </div>
                <div class="ckeditor-modal-close">
                    <button @click.prevent="close" class="h-8 w-8 m-0 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fill="currentColor" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="ckeditor-modal-content">
                <slot name="default"/>
            </div>
            <div class="ckeditor-modal-footer bg-white dark:bg-gray-800" v-if="hasSlot('footer')">
                <slot name="footer"/>
            </div>
        </div>
    </transition>
</template>
<style lang="sass" scoped>
.ckeditor-modal
    position: fixed
    display: flex
    top: 0
    bottom: 0
    left: 0
    right: 0
    width: 100vw
    height: 100vh
    flex-direction: column
    z-index: 50

.ckeditor-modal-container
    flex: 1
    display: flex
    flex-direction: row

.ckeditor-modal-header
    flex-shrink: 1
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    padding: 0 10px
    .ckeditor-modal-title
        flex-shrink: 1
        padding: 5px
    .ckeditor-modal-slot
        flex-grow: 1
        padding: 5px
    .ckeditor-modal-close
        flex-shrink: 1
        padding: 5px

.ckeditor-modal-content
    flex: 1
    overflow-y: auto
.ckeditor-modal-footer
    flex-shrink: 1
    padding: 10px

.ckeditor-modal-enter-active,
.ckeditor-modal-leave-active
    transition: all 160ms ease-in-out
.ckeditor-modal-enter-from,
.ckeditor-modal-leave-to
    transform: scale(1.1)
    opacity: 0
</style>
<style lang="sass">
html.modal-open,
html.modal-open body
    overflow: hidden !important
</style>

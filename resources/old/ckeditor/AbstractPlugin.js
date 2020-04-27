import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';
export default class AbstractPlugin{
    /**
     * @inheritDoc
     */
    constructor( editor ) {
        this.editor = editor;
    }

    /**
     * Stop Listening to
     * @inheritDoc
     */
    destroy() {
        try{
            this.stopListening();
        }catch (e) {
            console.error(e.message)
        }
    }
}
mix(AbstractPlugin, ObservableMixin);


/**
 * CkEditor Plugin API
 * @docs https://ckeditor.com/docs/ckeditor5/latest/api/
 * @example https://stackoverflow.com/questions/51303892/how-to-add-target-attribute-to-a-tag-in-ckeditor5/51365516#51365516
 */
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import AbstractPlugin from './AbstractPlugin'
export default class InsertImage extends AbstractPlugin{

    /**
     * Write Document Content.
     * @return void
     */
    init() {
        // Handle custom delete behaviour.
        this.editor.model.schema.extend('image', {
            allowAttributes: [
                'mediaId',
            ],
        });
        this.editor.conversion.attributeToAttribute({
            model: 'mediaId',
            view: 'data-media-id',
        });

        if(this.editor.config.get('media.enabled')){
            this.editor.ui.componentFactory.add('insertImage', (locale) => this.createButton(locale))

            //Capture Event from Vue Instance.
            Nova.$on(this.editor.config.get('media.event') + ':selected', (selected) => this.writeContent(selected))
        }
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale){
        const view = new ButtonView(locale);
        view.set({
            label: 'Insert image',
            icon: imageIcon,
            tooltip: true
        });
        //Proxy Event to Vue Instance.
        view.on('execute', () => {
            this.selected = this.editor.model.document.selection.getSelectedElement()
            Nova.$emit(this.editor.config.get('media.event'))
        });
        return view
    }

    /**
     * Is Image Element
     * @return {boolean}
     */
    get isImageFigure(){
        return (this.selected && this.selected.name === 'image')
    }

    /**
     * Write Document Content.
     * @param selected
     * @return void
     */
    writeContent(selected){
        this.editor.model.change(writer => {
            if(this.isImageFigure && selected.length === 1){
                writer.setAttributes({
                    'data-media-id': selected[0].id,
                    src: `${Nova.config.media_storage_path}/${selected[0].file}`,
                }, this.selected)
            }else{
                selected.forEach((item)=>{
                    const url = `${Nova.config.media_storage_path}/${item.file}`
                    const position = this.editor.model.document.selection.getLastPosition()
                    const element = writer.createElement('image', {
                        'data-media-id': item.id,
                        src: url,
                        //sizes: '100w',
                        //srcset: {
                            //data: url,
                            //width: "200px"
                        //},
                    })
                    this.editor.model.insertContent(element,position)
                })
            }
        })
    }

    /**
     * Get Required Children
     * @inheritDoc
     */
    static get requires() {
        return ['Image']
    }

    /**
     * Get the Plugin Name
     * @inheritDoc
     */
    static get pluginName() {
        return 'InsertImage'
    }
}

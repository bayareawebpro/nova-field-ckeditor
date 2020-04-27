/**
 * CkEditor Plugin API
 * @docs https://ckeditor.com/docs/ckeditor5/latest/api/
 * @example https://stackoverflow.com/questions/51303892/how-to-add-target-attribute-to-a-tag-in-ckeditor5/51365516#51365516
 */
import AbstractPlugin from './AbstractPlugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import svgIcon from './svg/insertCallout.svg';
export default class InsertCallout extends AbstractPlugin{

    /**
     * Write Document Content.
     * @return void
     */
    init() {

        //Add Button to UI
        this.editor.ui.componentFactory.add('insertCallout', (locale) => this.createButton(locale))
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale){
        const view = new ButtonView(locale);
        view.set({
            label: 'Insert Callout',
            icon: svgIcon,
            tooltip: true
        });
        //Proxy Event to Vue Instance.
        view.on('execute', () => this.writeContent());
        return view
    }

    /**
     * Write Document Content.
     * @return void
     */
    writeContent(){
        this.editor.model.change(writer => {
            if(Nova.config.ckeditor_callout){
                writer.insertText(Nova.config.ckeditor_callout, { bold: false }, this.editor.model.document.selection.getLastPosition() );
            }
        })
    }

    /**
     * Get Required Children
     * @inheritDoc
     */
    static get requires() {
        return []
    }

    /**
     * Get the Plugin Name
     * @inheritDoc
     */
    static get pluginName() {
        return 'InsertCallout'
    }
}

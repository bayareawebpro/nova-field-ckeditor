/**
 * CkEditor Plugin API
 * @docs https://ckeditor.com/docs/ckeditor5/latest/api/
 * @example https://stackoverflow.com/questions/51303892/how-to-add-target-attribute-to-a-tag-in-ckeditor5/51365516#51365516
 */
import AbstractPlugin from './AbstractPlugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import svgIcon from './svg/indent.svg';
export default class IndentText extends AbstractPlugin{

    /**
     * Write Document Content.
     * @return void
     */
    init() {

        //Add Button to UI
        this.editor.ui.componentFactory.add('indentText', (locale) => this.createButton(locale))
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale){
        const view = new ButtonView(locale);
        view.set({
            label: 'Indent Text',
            icon: svgIcon,
            tooltip: true
        });
        //Proxy Event to Vue Instance.
        view.on('execute', () => {
            this.writeContent()
        });
        return view
    }

    /**
     * Write Document Content.
     * @return void
     */
    writeContent(){
        this.editor.model.change(writer => {
            writer.insertText("     ", {}, this.editor.model.document.selection.getLastPosition() );
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
        return 'IndentText'
    }
}

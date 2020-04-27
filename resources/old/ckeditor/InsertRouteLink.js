/**
 * CkEditor Plugin API
 * @docs https://ckeditor.com/docs/ckeditor5/latest/api/
 * @example https://stackoverflow.com/questions/51303892/how-to-add-target-attribute-to-a-tag-in-ckeditor5/51365516#51365516
 */
import AbstractPlugin from './AbstractPlugin'
//import Link from "@ckeditor/ckeditor5-link/src/link"
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import routeLink from './svg/routeLink.svg';
export default class InsertRouteLink extends AbstractPlugin{

    /**
     * Write Document Content.
     * @return void
     */
    init() {
        this.text = null
        this.position = null
        this.selected = null

        //Extend Default Attributes
        this.extendAttributes();

        if(this.editor.config.get('routes.enabled')) {
            //Add Button to UI
            this.editor.ui.componentFactory.add('insertRouteLink', (locale) => this.createButton(locale))

            //Capture Event from Vue Instance.
            Nova.$on(this.editor.config.get('routes.event') + ':selected', (selected) => this.writeContent(selected))
        }
    }

    /**
     * Extend Default Link Attributes
     */
    extendAttributes(){
        const attributes = {
            linkRel: 'rel',
            linkTarget: 'target',
            linkTitle: 'title',
        }
        const keys = Object.keys(attributes)
        this.editor.model.schema.extend('$text', {
            allowAttributes: keys,
        });
        keys.forEach((model) => {
            this.editor.conversion.for( 'downcast' ).attributeToElement({
                model: model,
                view: (attributeValue, writer) => {
                    let setter = {}
                    setter[attributes[model]] = attributeValue
                    return writer.createAttributeElement('a', setter, {priority: 5});
                },
                converterPriority: 'high'
            });
        })
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale){
        const view = new ButtonView(locale);
        view.set({
            label: 'Insert Route',
            icon: routeLink,
            tooltip: true
        });
        //Proxy Event to Vue Instance.
        view.on('execute', () => {
            this.setSelection()
            console.log(this.editor.config.get('routes.event'))
            Nova.$emit(this.editor.config.get('routes.event'))
        });
        return view
    }

    /**
     * Set Selection
     */
    setSelection(){
        this.text = null
        this.position = this.editor.model.document.selection
        this.selected = this.editor.model.getSelectedContent(this.position)
        if(this.selected && this.selected.getChild(0)){
            this.text = this.selected.getChild(0).data
        }
    }

    /**
     * Write Document Content.
     * @param link
     * @return void
     */
    writeContent(link){
        this.setSelection()
        this.editor.model.change(writer => {
            const element = writer.createText(this.text || link.title, {
                linkHref: `/${link.slug}/`,
                linkTitle: link.title,
                linkRel: 'follow',
            });
            this.editor.model.insertContent(element,this.position)
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
        return 'InsertRouteLink'
    }
}

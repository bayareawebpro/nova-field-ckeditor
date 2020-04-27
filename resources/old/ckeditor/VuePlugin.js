/**
 * NEEDS UPDATE TO CURRENT VERSION
 */
import Model from '@ckeditor/ckeditor5-ui/src/model'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import {toWidget} from '@ckeditor/ckeditor5-widget/src/utils'
import {createDropdown, addListToDropdown} from '@ckeditor/ckeditor5-ui/src/dropdown/utils'

import {upcastElementToElement, downcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters'

class AddComponent extends AbstractPlugin {

    /**
     * Non Editable Vue Component Category
     * https://stackoverflow.com/questions/52298444/create-non-editable-block-with-text-in-ckeditor-5
     */
    init() {
        this.editor.model.schema.register('vue-component', {
            allowIn: '$root',
            isObject: true,
            isBlock: true,
            isLimit: true,
            isReadOnly: false,
            allowAttributes: [
                'class',
                'is',
                'value'
            ],
        })

        /**
         * Attribute Conversion
         */
        this.editor.conversion.attributeToAttribute({
            model: 'is',
            view: 'is',
        })
        this.editor.conversion.attributeToAttribute({
            model: 'class',
            view: 'class',
            converterPriority: 'low',
        })
        this.editor.conversion.attributeToAttribute({
            model: 'value',
            view: 'value',
        })

        /**
         * UpCast HTML View to Model - Convert HTML Element to CkEditor Model
         */
        this.editor.conversion.for('upcast').add(upcastElementToElement({
            view: {
                name: 'component', //HTML Category
                class: 'vue-component' //Class
            },
            model: 'vue-component', //CkEditor Model
        }))

        /**
         * DownCast Model to Editor HTML - Convert the Model to an Editor Widget
         * Parse: <component class="vue-component" is="something" some-prop="value"></component>
         * Output: <figure class="vue-component"></figure>
         */
        this.editor.conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'vue-component',
            view: (model, writer) => {
                const element = writer.createContainerElement('figure', this.defaultAttributes(model))
                return toWidget(element, writer, {
                    label: 'Vue Module',
                    withText: true,
                })
            }
        }))

        /**
         * DownCast Model to Output HTML
         * Save the Final Vue Component Markup
         * <component class="vue-component" is="something" some-prop="value"></component>
         */
        this.editor.conversion.for('dataDowncast').add(downcastElementToElement({
            model: 'vue-component', //CkEditor Model
            view: (model, writer) => {
                return writer.createContainerElement('component', this.defaultAttributes(model))
            }
        }))


        /**
         * Create the CkEditor Component
         * https://stackoverflow.com/questions/52298444/create-non-editable-block-with-text-in-ckeditor-5
         */
        this.editor.ui.componentFactory.add('vue-component', locale => {

            /** Setup DropDown Menu for Available Components **/
            const view = createDropdown(locale)
            this.createDropdown(view)
            view.buttonView.set({
                label: 'Vue',
                withText: true,
                tooltip: true
            })
            view.on('execute', (event) => {
                this.editor.model.change(writer => {
                    const element = writer.createElement('vue-component', event.source.insert.props)
                    this.editor.model.insertContent(element,  this.editor.model.document.selection.getLastPosition())
                })
            })
            return view
        })
    }

    /**
     * Setup DropDown Menu Item Collection
     */
    createDropdown(view){
        const dropDownItems = new Collection()

        const items = [
            {
                label: 'test-comp',
                value: 'test-comp',
                is: 'test-comp',
            },
        ]
        items.map((comp)=>{
            return {
                type: 'button',
                model: new Model(
                    {
                        label: comp.label,
                        withText: true,
                    },
                    {
                        insert: {
                            props: {
                                is: comp.is,
                                value: comp.value,
                                class: 'vue-component',
                            }
                        },
                    }
                )
            }
        }).forEach((comp)=>dropDownItems.add(comp))
        addListToDropdown(view, dropDownItems)

    }

    /**
     * Get Default Attributes
     */
    defaultAttributes(model){
        return Object.assign({}, {class: 'vue-component'}, model.getAttributes())
    }
}

export default class VuePlugin extends AbstractPlugin {
    /**
     * Get Required Children
     * @inheritDoc
     */
    static get requires() {
        return [AddComponent, Widget]
    }

    /**
     * Get the Plugin Name
     * @inheritDoc
     */
    static get pluginName() {
        return 'VuePlugin'
    }
}


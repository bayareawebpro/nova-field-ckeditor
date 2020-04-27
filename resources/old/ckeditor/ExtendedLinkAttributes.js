import AbstractPlugin from './AbstractPlugin'
import Link from "@ckeditor/ckeditor5-link/src/link"
import {downcastAttributeToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters'
export default class ExtendedLinkAttributes extends AbstractPlugin {

    /**
     * Automatic Extended Link Attributes.
     */
    init() {
        this.editor.model.schema.extend('$text', {
            allowAttributes: [
                'linkTarget'
            ],
        });
        this.editor.conversion.for('downcast').add(downcastAttributeToElement({
            model: 'linkTarget',
            converterPriority: 'high',
            view: (attributeValue, writer) => {
                return writer.createAttributeElement('a', {target: attributeValue}, {priority: 5});
            },
        }));
    }

    /**
     * Get Required Children
     * @inheritDoc
     */
    static get requires() {
        return [Link];
    }

    /**
     * Get the Plugin Name
     * @inheritDoc
     */
    static get pluginName() {
        return 'ExtendedLinkAttributes';
    }
}

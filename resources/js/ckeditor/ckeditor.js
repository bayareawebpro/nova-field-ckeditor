'use strict';

// Base Editor
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

// Block Elements
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Table from '@ckeditor/ckeditor5-table/src/table'

// Block Elements
import AutoFormat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import List from '@ckeditor/ckeditor5-list/src/list'

// Styles & Enhancements
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import StrikeThrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript'
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Link from '@ckeditor/ckeditor5-link/src/link'

// Images and Media
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import ImageTextAlternative from '@ckeditor/ckeditor5-image/src/imagetextalternative'

import MediaBrowser from './plugins/MediaBrowser'
import InsertSnippet from './plugins/InsertSnippet'
import LinkBrowser from "./plugins/LinkBrowser"

// Extend the Base Class
export default class CkEditor extends ClassicEditorBase {

    // Merge Configurations
    static get defaultConfig(){
        return {
            licenseKey: '',
            language: 'en',
            ...require('./config/link').default,
            ...require('./config/image').default,
            ...require('./config/media').default,
            ...require('./config/table').default,
            ...require('./config/toolbar').default,
            ...require('./config/headings').default,
        }
    }

    // Add Plugins
    static get builtinPlugins(){
        return [
            MediaBrowser,
            LinkBrowser,
            InsertSnippet,
            Essentials,
            Link,
            List,
            Heading,
            Paragraph,
            BlockQuote,
            PasteFromOffice,
            HorizontalLine,
            Bold,
            Italic,
            Underline,
            Subscript,
            Alignment,
            AutoFormat,
            Superscript,
            StrikeThrough,
            Image,
            ImageStyle,
            ImageUpload,
            ImageCaption,
            ImageToolbar,
            ImageTextAlternative,
            MediaEmbed,
            Table,
            TableToolbar,
        ]
    }
}

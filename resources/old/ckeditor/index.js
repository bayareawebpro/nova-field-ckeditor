//Elements
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Table from '@ckeditor/ckeditor5-table/src/table'
import List from '@ckeditor/ckeditor5-list/src/list'

//Style
import StrikeThrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Link from '@ckeditor/ckeditor5-link/src/link'

//Media
import ImageTextAlternative from '@ckeditor/ckeditor5-image/src/imagetextalternative'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import Image from '@ckeditor/ckeditor5-image/src/image'

//My Custom Plugins
import InsertRouteLink from './InsertRouteLink'
import InsertCallout from './InsertCallout'
import InsertImage from './InsertImage'
import IndentText from './IndentText'
import InsertHr from './InsertHr'

//Configuration
export default {
    routes:{
        enabled: true,
        event: 'ckeditor:routes',
    },
    media:{
        enabled: true,
        event: 'ckeditor:media',
    },
    plugins: [
        // Text
        Essentials,
        BlockQuote,
        Heading,
        Paragraph,
        List,
        Link,
        Alignment,
        StrikeThrough,
        Underline,
        Italic,
        Bold,
        Table,
        TableToolbar,

        // Media
        Image,
        ImageStyle,
        ImageCaption,
        ImageTextAlternative,
        ImageToolbar,
        MediaEmbed,

        // Custom
        InsertImage,
        InsertRouteLink,
        InsertCallout,
        IndentText,
        InsertHr,
    ],
    toolbar: [
        'heading',
         '|',
        'indentText',
        'alignment',
        'bold',
        'italic',
        'underline',
        'strikethrough',
         '|',
        'insertHr',
        'link',
        'insertRouteLink',
        'insertCallout',
        '|',
        'bulletedList',
        'numberedList',
        'blockQuote',
        'insertTable',
        'insertImage',
        'mediaEmbed',
        '|',
        'undo',
        'redo',
    ],
    table: {
        contentToolbar: [
            'tableRow',
            'tableColumn',
            'mergeTableCells',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'insertImage',
            'link',
        ],
    },
    image: {
        toolbar: [
            'insertImage',
            '|',
            'imageStyle:full',
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
            '|',
            'imageTextAlternative',
        ],
        styles: [
            'full',
            'side',
            'alignLeft',
            'alignCenter',
            'alignRight'
        ]
    },
    mediaEmbed: {
        previewsInData: true,
        providers: [
            {
                name: 'youtube',
                url: [
                    /^https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/,
                    /^https:\/\/www\.youtube\.com\/v\/([\w-]+)/,
                    /^https:\/\/www\.youtube\.com\/embed\/([\w-]+)/,
                    /^https:\/\/www\.youtu\.be\/([\w-]+)/
                ],
                html: match => {
                    return `
                        <div class="embed-responsive embed-responsive-16by9">
                            <iframe src="https://www.youtube.com/embed/${match[1]}" class="embed-responsive-item" allowfullscreen></iframe>
                        </div>
                   `
                }
            },
        ]
    },
    heading: {
        options: [
            { model: 'paragraph', view: 'p',  title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1',  view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2',  view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3',  view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4',  view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5',  view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6',  view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
        ]
    },
}

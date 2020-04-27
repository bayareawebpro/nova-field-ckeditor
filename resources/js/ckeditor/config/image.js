/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/image.html
 */
export default {
    image:{
        upload: {
            types: ['gif','png','jpg','jpeg']
        },
        toolbar: [
            'mediaBrowser',
            'imageStyle:full',
            'imageStyle:side',
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
            'imageTextAlternative',
        ],
        styles: [
            'alignLeft',
            'alignCenter',
            'alignRight',
            'full',
            'side',
        ]
    }
}

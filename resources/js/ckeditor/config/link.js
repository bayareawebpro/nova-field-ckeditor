/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/link.html
 * https://ckeditor.com/docs/ckeditor5/latest/api/module_link_link-LinkConfig.html#member-decorators
 * https://ckeditor.com/docs/ckeditor5/latest/api/module_link_link-LinkConfig.html#member-addTargetToExternalLinks
 */
export default {
    link: {
        addTargetToExternalLinks: true,
        decorators: {
            isExternal: {
                mode: 'automatic',
                callback: url => ()=>(
                    url.startsWith( 'http://' ) ||
                    url.startsWith( 'https://' )
                ),
                attributes: {
                    target: '_blank'
                }
            },
        }
    }
}

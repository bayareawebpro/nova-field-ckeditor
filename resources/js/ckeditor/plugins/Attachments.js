export default class Attachments {
    static make(callback) {
        return {
            attachments: {
                label: Attachments.label,
                icon: Attachments.icon,
                execute: (editor)=>{
                    const selected = editor.model.document.selection.getSelectedElement()

                    callback((entities) => {
                        editor.model.change((writer) => {
                            ([].concat(entities)).forEach(({original, mime, url, download, visibility}, index) => {
                                if(index === 0 && selected?.name === 'imageBlock') {
                                    return writer.setAttributes({src: url, alt: original, imageCaption: original}, selected)
                                }
                                return editor.model.insertContent(
                                    writer.createElement('imageBlock', {src: url, alt: original, imageCaption: original}),
                                    editor.model.document.selection.getLastPosition()
                                )
                            })
                        })
                    })
                }
            }
        }
    }

    static get label(){
        return 'Media'
    }

    static get icon(){
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path clip-rule="evenodd" fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg>`
    }
}

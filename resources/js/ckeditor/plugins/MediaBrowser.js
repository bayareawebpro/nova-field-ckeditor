import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
export default class MediaBrowser{

    constructor( editor ) {
        this.config = editor.config;
        this.model = editor.model;
        this.ui = editor.ui;
    }

    /**
     * Get the Plugin Name
     */
    static get pluginName() {
        return 'mediaBrowser'
    }

    /**
     * Get Required Children
     */
    static get requires() {
        return []
    }

    /**
     * Write Document Content.
     * @return void
     */
    init() {
        this.ui.componentFactory.add('mediaBrowser', this.createButton.bind(this))
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale){
        const view = new ButtonView(locale)
        view.set({
            tooltip: true,
            label: 'Insert Image',
            icon: this.icon
        })
        const field = this.config.get('fieldName')
        view.set('isVisible', this.config.get('mediaBrowser'))
        view.on('execute', ()=>Nova.$emit(`ckeditor:media:${field}`))
        Nova.$on(`ckeditor:media:${field}:write`, this.writeContent.bind(this))
        return view
    }

    /**
     * Write Document Content.
     * @param items {Array}
     * @return void
     */
    writeContent(items){
        if(items.length > 0){
            let widget = this.model.document.selection.getSelectedElement()
            this.model.change(writer => {
                items.forEach((item)=>{
                    if(widget && widget.name === 'image'){
                        writer.setAttributes({src: item.url}, widget)
                        widget = false
                    }else{
                        this.model.insertContent(
                            writer.createElement('image', {src: item.url}),
                            this.model.document.selection.getLastPosition()
                        )
                    }
                })
            })
        }
    }

    /**
     * Get the Icon
     * @return string
     */
    get icon(){
        return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"/></svg>`
    }

    /**
     * Destroy Instance
     * @return void
     */
    destroy() {}
}

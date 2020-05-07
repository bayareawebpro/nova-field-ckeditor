import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class LinkBrowser{

    constructor( editor ) {
        this.editor = editor;
        this.config = editor.config;
        this.model = editor.model;
        this.ui = editor.ui;
    }

    /**
     * Get the Plugin Name
     */
    static get pluginName() {
        return 'linkBrowser'
    }

    /**
     * Get Required Children
     */
    static get requires() {
        return ['Link']
    }

    /**
     * Initialize the plugin.
     * Start listening for events.
     * @return void
     */
    init() {
        this.ui.componentFactory.add('linkBrowser',this.createButton.bind(this))
        this.ui.focusTracker.on( 'change:isFocused', ( evt, name, value ) => {
            if(value === true){
                Nova.$emit(`ckeditor:focused`, this.fieldName)
            }
        });
        Nova.$on(`ckeditor:link:${this.fieldName}:write`, this.writeContent.bind(this))
    }

    /**
     * Destroy Instance
     * Stop listening for events.
     * @return void
     */
    destroy() {
        Nova.$off(`ckeditor:link:${this.fieldName}:write`, this.writeContent.bind(this))
    }

    /**
     * Create the ButtonView
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale){

        const view = new ButtonView(locale)

        view.set({
            tooltip: true,
            label: 'Insert Link',
            icon: this.icon
        })

        if(this.isEnabled){
            view.on('execute', this.openModal.bind(this))
        }

        view.set('isVisible', this.isEnabled)
        return view
    }

    /**
     * Launch the Link Browser.
     */
    openModal(){
        Nova.$emit(`ckeditor:link:${this.fieldName}`)
    }

    /**
     * Save the editor selection.
     */
    saveSelection(){
        try{
            this.position = this.model.document.selection
            this.selected = this.model.getSelectedContent(this.position)
            if(this.selected && this.selected.getChild(0)){
                this.text = this.selected.getChild(0).data || null
            }
        }catch (e) {
            console.error(e)
        }
    }

    /**
     * Clear the saved editor selection.
     */
    clearSelection(){
        this.text = null
        this.position = null
        this.selected = null
    }

    /**
     * Is the plugin enabled?
     * @return {boolean}
     */
    get isEnabled(){
        return this.config.get('linkBrowser')
    }

    /**
     * Get the Nova field name.
     * @return {boolean}
     */
    get fieldName(){
        return this.config.get('fieldName')
    }

    /**
     * Write Document Content.
     * @param link
     * @return void
     */
    writeContent(link){
        this.model.change(writer => {
            this.saveSelection()
            this.model.insertContent(writer.createText(this.text || link.title, {
                linkHref: `/${link.slug}/`,
                linkTitle: link.title,
            }),this.position)
            this.clearSelection()
        })
    }

    /**
     * Get the Icon
     * @return string
     */
    get icon(){
        return `<svg height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><path d="m17.567 15.938-2.859-2.702c.333-.605.539-1.29.539-2.029 0-2.342-1.897-4.239-4.24-4.239s-4.243 1.896-4.243 4.239 1.9 4.241 4.243 4.241c.826 0 1.59-.246 2.242-.654l2.855 2.699c.432-.571.919-1.094 1.463-1.555z"/><path d="m29.66 15.6 3.799-6.393c.374.107.762.184 1.169.184 2.347 0 4.244-1.898 4.244-4.241 0-2.342-1.897-4.239-4.244-4.239-2.343 0-4.239 1.896-4.239 4.239 0 1.163.469 2.214 1.227 2.981l-3.787 6.375c.651.295 1.265.663 1.831 1.094z"/><path d="m42.762 20.952c-1.824 0-3.369 1.159-3.968 2.775l-5.278-.521c0 .04.006.078.006.117 0 .688-.076 1.36-.213 2.009l5.276.521c.319 2.024 2.062 3.576 4.177 3.576 2.342 0 4.238-1.896 4.238-4.238 0-2.341-1.896-4.239-4.238-4.239z"/><path d="m28.197 37.624-1.18-5.156c-.666.232-1.359.398-2.082.481l1.182 5.157c-1.355.709-2.29 2.11-2.29 3.746 0 2.342 1.896 4.237 4.243 4.237 2.342 0 4.238-1.896 4.238-4.237.003-2.299-1.829-4.16-4.111-4.228z"/><path d="m14.357 25.37-6.57 2.201c-.758-1.158-2.063-1.926-3.548-1.926-2.343 0-4.239 1.897-4.239 4.239 0 2.345 1.896 4.242 4.239 4.242 2.341 0 4.242-1.897 4.242-4.242 0-.098-.021-.188-.029-.284l6.591-2.207c-.297-.641-.533-1.316-.686-2.023z"/><circle cx="23.83" cy="23.323" r="7.271"/></svg>`
    }
}

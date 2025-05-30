import { appToast } from "."
import type { CustomModal, CustomPage } from "../elements"

export class AppMain extends HTMLElement {
    private shadow: ShadowRoot

    constructor() {
        super()
        this.shadow = this.attachShadow({mode: 'closed'})
        this.render()

        this.onClick = this.onClick.bind(this)
    }

    connectedCallback() {
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onClick)
    }

    private render() {
        const slot = document.createElement('slot')
        const nav = this._createNav()

        this.shadow.appendChild(nav)
        this.shadow.appendChild(slot)
    }

    private onClick(e: Event) {
        const target = e.target as HTMLElement

        if (target.hasAttribute('data-toast')) {
            appToast.showMessage('Test Toast')
        }

        if (target.hasAttribute('data-button')) {
            const key = target.dataset.button
            const id = target.dataset.target

            if (key === 'open-modal' && id) {
                const elem = document.getElementById(id) as CustomModal
                elem?.openModal()
            }

            if (key === 'close-modal' && id) {
                const elem = document.getElementById(id) as CustomModal
                elem?.closeModal()
            }

            if (key === 'open-page' && id) {
                const elem = document.getElementById(id) as CustomPage
                elem?.openPage()
            }

            if (key === 'close-page' && id) {
                const elem = document.getElementById(id) as CustomPage
                elem?.closePage()
            }
        }
    }

    private _createNav() {
        const elem = document.createElement('nav')
        elem.setAttribute('part', 'nav')

        const slot = document.createElement('slot')
        slot.name = 'nav'
        elem.appendChild(slot)

        return elem
    }
}

customElements.define('app-main', AppMain)
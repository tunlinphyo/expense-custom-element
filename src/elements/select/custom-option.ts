import { css } from "../utils"

const hostStyle = css`
    :host {
        display: block;
        cursor: pointer;
        pointer-events: auto;
    }

    :host([selected]) {
        background-color: lightblue;
    }

    ::slotted(*) {
        pointer-events: none;
    }
`

export class CustomOption extends HTMLElement {
    private renderRoot: ShadowRoot

    get value() {
        return this.getAttribute('value') || ''
    }

    constructor() {
        super()
        this.renderRoot = this.attachShadow({mode: 'closed'})
        this.renderRoot.adoptedStyleSheets = [hostStyle]

        this.onClick = this.onClick.bind(this)
        this.render()
    }

    getNode(): DocumentFragment {
        const fragment = document.createDocumentFragment()
        Array.from(this.children).forEach(child => {
            fragment.appendChild(child.cloneNode(true))
        })
        return fragment
    }

    connectedCallback() {
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onClick)
    }

    private onClick() {
        this.dispatchEvent(new Event('select', {
            bubbles: true,
            cancelable: true,
        }))
    }

    private render() {
        const slot = document.createElement('slot')
        this.renderRoot.appendChild(slot)
    }
}

customElements.define('custom-option', CustomOption)
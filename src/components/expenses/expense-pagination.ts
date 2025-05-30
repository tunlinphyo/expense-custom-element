

export class ExpensePagination extends HTMLElement {
    private shadow: ShadowRoot

    constructor() {
        super()
        this.shadow = this.attachShadow({mode: 'closed'})

        this.render()
    }

    private render() {
        this.setAttribute('pagination', '')

        const slot = document.createElement('slot')
        const el = document.createElement('div')
        el.setAttribute('part', 'container')

        el.appendChild(slot)
        this.shadow.appendChild(el)
    }
}

customElements.define('expense-pagination', ExpensePagination)
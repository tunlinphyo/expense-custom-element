import { AppNumber } from "../utils/number"

export class CurrencyDisplay extends HTMLElement {
    private renderRoot: ShadowRoot
    private _length: number = 0

    static get observedAttributes(): string[] {
        return ['value', 'currency']
    }

    get textLength() {
        return this._length
    }

    constructor() {
        super()
        this.renderRoot = this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
        this.setAttribute('currency', 'JPY')
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name: string) {
        if (['value', 'currency'].includes(name)) {
            this.render()
        }
    }

    private render() {
        const value = Number(this.getAttribute('value')) || 0
        const currency = this.getAttribute('currency')
        const miniSign = this.hasAttribute('mini-sign')
        if (currency) {
            const price = AppNumber.price(Number(value), currency)
            const [sign, num] = this.splitCurrency(price)
            this._length = num.length + Math.ceil(sign.length / 2)
            const html = `
                <span class="${miniSign ? 'sign' : ''}">${sign}</span><span class="amount-number">${num}</span>
            `
            this.renderRoot.innerHTML = html
        }
    }

    private splitCurrency(value: string): [string, string] {
        const match = value.match(/^([^\d.,\s]+)([\d.,\s]+)$/)
        if (match) {
            return [match[1], match[2].trim()]
        }
        return ["", value.trim()]
    }
}

customElements.define("currency-display", CurrencyDisplay)
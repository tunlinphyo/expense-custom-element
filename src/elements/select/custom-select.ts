import { CustomSelected } from './custom-selected'
import { CustomOption } from './custom-option'
import { css, html } from '..'
import { Animator } from '../animations'

import './custom-selected'
import './custom-option'

const hostStyles = css`
    dialog {
        &::backdrop {
            background-color: var(--backdrop-bg);
            backdrop-filter: var(--backdrop-filter);
            transition: opacity .3s ease;
            opacity: 0;
        }
        &[open] {
            &::backdrop {
                opacity: 1;

                @starting-style {
                    opacity: 0;
                }
            }
        }
        &.closing {
            &::backdrop {
                opacity: 0;
            }
        }
    }
    [data-button] {
        * {
            pointer-events: none;
        }
    }
`

export class CustomSelect extends HTMLElement {
    private renderRoot: ShadowRoot
    private dialog: HTMLDialogElement
    private selectedEl: CustomSelected | null
    private slotEl: HTMLSlotElement
    protected optionMap: Map<string, CustomOption> = new Map()

    private _value: string = ''

    static get observedAttributes() {
        return ['value']
    }

    get value() {
        return this._value
    }
    set value(data: string) {
        this._value = data
        this.setAttribute('value', this.value)
    }

    constructor() {
        super()
        this.renderRoot = this.attachShadow({mode: 'open'})
        this.renderRoot.adoptedStyleSheets = [hostStyles]
        this.dialog = document.createElement('dialog')
        this.slotEl = document.createElement('slot')
        this.selectedEl = this.querySelector('custom-selected')

        this.onButtonClick = this.onButtonClick.bind(this)
        this.setOptions = this.setOptions.bind(this)
        this.onDialogClick = this.onDialogClick.bind(this)

        this.render()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'value' && newValue !== oldValue) {
            this.renderSelected(newValue, oldValue)
        }
    }

    connectedCallback() {
        this.setOptions()

        this.addEventListener('click', this.onButtonClick)
        this.addEventListener('loaded', this.setOptions)
        this.dialog.addEventListener('click', this.onDialogClick)
    }

    disconnectedCallback() {
        this.optionMap = new Map()
        this.removeEventListener('click', this.onButtonClick)
        this.removeEventListener('loaded', this.setOptions)
        this.dialog.removeEventListener('click', this.onDialogClick)
    }

    openSelect() {
        this.dialog.showModal()
        this.dialog.setAttribute('part', 'selectpopup open')
        Animator.openSelect(this.dialog)
    }

    closeSelect() {
        this.dialog.classList.add('closing')
        const animation = Animator.closeSelect(this.dialog)
        animation.finished.then(() => {
            this.dialog.close()
            this.dialog.classList.remove("closing")
            this.dialog.setAttribute('part', 'selectpopup')
        })
    }

    protected setOptions() {
        const options = this.querySelectorAll<CustomOption>('custom-option')
        Array.from(options).forEach(elem => {
            this.optionMap.set(elem.value, elem)
        })
    }

    private render() {
        this.setAttribute('data-select', '')

        const slot = document.createElement('slot')
        slot.name = 'button'

        const section = document.createElement('div')
        section.className = 'section'

        this.dialog.setAttribute('part', 'selectpopup themereverse')

        const node = html`
            <button part="button icononly" type="button" data-button="done" data-icon-only>
                <svg-icon name="close" size="14"></svg-icon>
            </button>
        `

        section.appendChild(this.slotEl)
        this.dialog.appendChild(section)
        this.dialog.appendChild(node)
        this.renderRoot.appendChild(slot)
        this.renderRoot.appendChild(this.dialog)
    }

    private onButtonClick(e: Event) {
        const target = e.target as HTMLElement
        if (target.hasAttribute('data-button')) {
            this.openSelect()
        }
    }

    private onDialogClick(e: Event) {
        const target = e.target as HTMLElement
        console.log(target.tagName)
        if (target.tagName === 'CUSTOM-OPTION') {
            const value = (target as CustomOption).value
            this.setAttribute('value', value)
            this.closeSelect()
        } else if (target.hasAttribute('data-button') && target.dataset.button === 'done') {
            this.closeSelect()
        } else if (target === this.dialog) {
            this.closeSelect()
        }
    }

    private renderSelected(value: string, old: string) {
        const prevSelected = this.optionMap.get(old)
        const selected = this.optionMap.get(value)

        prevSelected?.removeAttribute('selected')
        if (selected) {
            selected.setAttribute('selected', '')
            if (this.selectedEl) {
                const cloned = selected.getNode()
                this.selectedEl.replaceNode(cloned)
            }
        }
    }
}

customElements.define('custom-select', CustomSelect)
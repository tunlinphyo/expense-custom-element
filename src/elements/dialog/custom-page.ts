import { Animator } from "../animations"
import { css } from "../utils"

const hostStyle = css`
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
`

export class CustomPage extends HTMLElement {
    private shadow: ShadowRoot
    private dialog: HTMLDialogElement

    private startX: number = Infinity
    private currentX: number = 0
    private isDragging: boolean = false

    static get observedAttributes() {
        return ['opened']
    }

    constructor() {
        super()
        this.shadow = this.attachShadow({mode: 'closed'})
        this.shadow.adoptedStyleSheets = [hostStyle]
        this.dialog = this._createDialog()

        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)

        this.render()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'opened' && oldValue != newValue) {
            if (newValue)
                this.dialog.setAttribute('part', `page noscrollbar ${newValue === 'true' ? 'open' : 'close'}`)
        }
    }

    connectedCallback() {
        this.dialog.addEventListener('touchstart', this.onTouchStart, true)
        this.dialog.addEventListener('touchmove', this.onTouchMove, true)
        this.dialog.addEventListener('touchend', this.onTouchEnd)
    }

    disconnectedCallback() {
        this.dialog.removeEventListener('touchstart', this.onTouchStart, true)
        this.dialog.removeEventListener('touchmove', this.onTouchMove, true)
        this.dialog.removeEventListener('touchend', this.onTouchEnd)
    }

    openPage() {
        this.dialog.showModal()
        const animation = Animator.openPage(this.dialog, 0)
        animation.finished.then(() => {
            this.setAttribute('opened', 'true')
        })
    }

    closePage(x: number = 0) {
        this.dialog.classList.add('closing')
        const animation = Animator.closePage(this.dialog, x)
        animation.finished.then(() => {
            this.dialog.close()
            this.dialog.classList.remove('closing')
            this.setAttribute('opened', 'false')
        })
    }

    private onTouchStart(event: TouchEvent): void {
        if (event.touches.length !== 1) return

        this.startX = event.touches[0].clientX
        this.currentX = this.startX
        if (this.startX > 40) return

        this.isDragging = true
    }

    private onTouchMove(event: TouchEvent): void {
        if (!this.isDragging) return

        this.currentX = event.touches[0].clientX
        const deltaX = this.currentX - this.startX
        if (deltaX > 0) {
            event.preventDefault()

            this.dialog.style.transform = `translateX(${deltaX}px)`
        }
    }

    private onTouchEnd(): void {
        this.dialog.removeAttribute('style')
        if (!this.isDragging) return

        const deltaX = this.currentX - this.startX
        this.isDragging = false

        if (deltaX > this.dialog.clientWidth * 0.3) {
            this.closePage(deltaX)
        } else if (deltaX > 1) {
            Animator.setPage(this.dialog, deltaX)
        }
    }

    private render() {
        this.setAttribute('data-page', '')
        this.shadow.appendChild(this.dialog)
    }

    private _createDialog() {
        const elem = document.createElement('dialog')
        const slot = document.createElement('slot')
        elem.setAttribute('part', 'page noscrollbar')
        elem.appendChild(slot)

        return elem
    }
}

customElements.define('custom-page', CustomPage)
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

export class CustomModal extends HTMLElement {
    private shadow: ShadowRoot
    private dialog: HTMLDialogElement

    private startY: number = 0
    private currentY: number = 0
    private isDragging: boolean = false
    private undraggable: boolean = false

    static get observedAttributes() {
        return ['opened']
    }

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'closed' })
        this.shadow.adoptedStyleSheets = [hostStyle]
        this.dialog = this._createDialog()

        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onClick = this.onClick.bind(this)

        this.render()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'opened' && oldValue != newValue) {
            if (newValue)
                this.dialog.setAttribute('part', `modal noscrollbar ${newValue === 'true' ? 'open' : 'close'}`)
        }
    }

    connectedCallback() {
        this.undraggable = this.hasAttribute('undraggable')
        this.dialog.addEventListener('touchstart', this.onTouchStart, true)
        this.dialog.addEventListener('touchmove', this.onTouchMove, true)
        this.dialog.addEventListener('touchend', this.onTouchEnd)
        this.dialog.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        this.dialog.removeEventListener('touchstart', this.onTouchStart, true)
        this.dialog.removeEventListener('touchmove', this.onTouchMove, true)
        this.dialog.removeEventListener('touchend', this.onTouchEnd)
        this.dialog.removeEventListener('click', this.onClick)
    }

    openModal() {
        this.dialog.showModal()
        const animation = Animator.openModal(this.dialog, 0)
        animation.finished.then(() => {
            this.setAttribute('opened', 'true')
        })
    }

    closeModal(y: number = 0) {
        this.dialog.classList.add('closing')
        const animation = Animator.closeModal(this.dialog, y)
        animation.finished.then(() => {
            this.dialog.close()
            this.dialog.classList.remove('closing')
            this.setAttribute('opened', 'false')
        })
    }

    private onClick(event: Event) {
        const target = event.target as HTMLElement
        if (target === this.dialog) {
            if (this.undraggable) return
            this.closeModal()
        }
    }

    private onTouchStart(event: TouchEvent): void {
        // const target = event.target as HTMLElement
        // const touchDisabled = (this.constructor as typeof ModalDialog).touchDisabledTags
        // if (touchDisabled.includes(target.tagName.toLowerCase())) return

        if (event.touches.length !== 1) return
        if (this.undraggable) return

        this.startY = event.touches[0].clientY
        this.currentY = this.startY
        const top = this.dialog.offsetTop

        if ((this.dialog.scrollTop || 0) > 0 && this.startY > top + 80) return
        if (this.startY < (top - 10)) return

        this.isDragging = true
    }

    private onTouchMove(event: TouchEvent): void {
        if (!this.isDragging) return

        this.currentY = event.touches[0].clientY
        const deltaY = this.currentY - this.startY

        if (deltaY > 0) {
            event.preventDefault()
            this.dialog.style.transform = `translateY(${deltaY}px)`
        }
    }

    private onTouchEnd(): void {
        this.dialog.removeAttribute('style')
        if (!this.isDragging) return

        const deltaY = this.currentY - this.startY
        this.isDragging = false

        if (deltaY > this.dialog.clientHeight * 0.3) {
            this.closeModal(deltaY)
        } else if (deltaY > 1) {
            Animator.setModal(this.dialog, deltaY)
        }
    }

    private render() {
        this.setAttribute('data-modal', '')
        this.shadow.appendChild(this.dialog)
    }

    private _createDialog() {
        const elem = document.createElement('dialog')
        const slot = document.createElement('slot')
        elem.setAttribute('part', 'modal noscrollbar')
        elem.appendChild(slot)

        return elem
    }
}

customElements.define('custom-modal', CustomModal)
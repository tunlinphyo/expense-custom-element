type Position = {
    x: number,
    y: number
}

export class SwipableItem extends HTMLElement {
    private shadow: ShadowRoot
    private leftEl: HTMLElement
    private rightEl: HTMLElement
    private containerEl: HTMLElement

    private start: Position = { x: 0, y: 0 }
    private current: Position = { x: 0, y: 0 }
    private isDragging: boolean = false

    constructor() {
        super()
        this.shadow = this.attachShadow({mode: 'closed'})
        this.leftEl = this.createAction('left')
        this.rightEl = this.createAction('right')
        this.containerEl = this.createContainer()

        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)

        this.render()
    }

    connectedCallback() {
        this.containerEl.addEventListener('touchstart', this.onTouchStart)
        this.containerEl.addEventListener('touchmove', this.onTouchMove)
        this.containerEl.addEventListener('touchend', this.onTouchEnd)
    }

    disconnectedCallback() {
        this.containerEl.removeEventListener('touchstart', this.onTouchStart)
        this.containerEl.removeEventListener('touchmove', this.onTouchMove)
        this.containerEl.removeEventListener('touchend', this.onTouchEnd)
    }

    private onTouchStart(event: TouchEvent): void {
        if (event.touches.length !== 1) return

        this.start.x = event.touches[0].clientX
        this.start.y = event.touches[0].clientY
        this.current.x = this.start.x
        this.current.y = this.start.y

        this.isDragging = true
    }

    private onTouchMove(event: TouchEvent): void {
        if (!this.isDragging) return

        this.current.x = event.touches[0].clientX
        this.current.y = event.touches[0].clientY
        const deltaX = this.current.x - this.start.x
        const deltaY = this.current.y - this.start.y

        if (Math.abs(deltaY) >= Math.abs(deltaX)) {
            this.isDragging = false
            return this.close(deltaX)
        }

        event.preventDefault()

        const target = event.target as HTMLElement
        const is = Math.abs(deltaX) > target.clientWidth * 0.3

        if (Math.abs(deltaX) > 10) {
            if (deltaX > 0) {
                this.leftEl.style.width = `${deltaX}px`
                if (is)
                    this.leftEl.style.setProperty('--scale', '1')
                else
                    this.leftEl.style.setProperty('--scale', '0')
            } else {
                this.rightEl.style.width = `${Math.abs(deltaX)}px`
                if (is)
                    this.rightEl.style.setProperty('--scale', '1')
                else
                    this.rightEl.style.setProperty('--scale', '0')
            }
        }

        this.containerEl.style.transform = `translateX(${deltaX}px)`
        this.containerEl.style.pointerEvents = 'none'
    }

    private onTouchEnd(event: TouchEvent): void {
        if (!this.isDragging) return

        const deltaX = this.current.x - this.start.x
        const deltaY = this.current.y - this.start.y
        const target = event.target as HTMLElement

        this.isDragging = false

        if (Math.abs(deltaY) >= Math.abs(deltaX)) {
            return this.close(deltaX)
        }

        if (Math.abs(deltaX) > target.clientWidth * 0.3) {
            this.action(deltaX)
        } else {
            this.close(deltaX)
        }
    }

    private action(x: number = 0) {
        const animation = this.containerEl.animate([
            { transform: `translateX(${x}px)`, zIndex: 2 },
            { transform: `translateX(0)`, zIndex: 2 }
        ], {
            duration: 300,
            easing: 'ease'
        })
        const elem = x > 0 ? this.leftEl : this.rightEl
        elem.animate([
            { width: `${x}px` },
            { width: `0px` }
        ], {
            duration: 300,
            easing: 'ease'
        })
        animation.finished.then(() => {
            this.containerEl.removeAttribute('style')
            elem.style.width = '0'
        })
    }

    private close(x: number = 0) {
        const animation = this.containerEl.animate([
            { transform: `translateX(${x}px)`, zIndex: 2 },
            { transform: `translateX(0)`, zIndex: 2 }
        ], {
            duration: 300,
            easing: 'ease'
        })
        const elem = x > 0 ? this.leftEl : this.rightEl
        elem.animate([
            { width: `${x}px` },
            { width: `0px` }
        ], {
            duration: 300,
            easing: 'ease'
        })
        animation.finished.then(() => {
            this.containerEl.removeAttribute('style')
            elem.style.width = '0'
        })
    }

    private render() {
        this.shadow.appendChild(this.leftEl)
        this.shadow.appendChild(this.containerEl)
        this.shadow.appendChild(this.rightEl)
    }

    private createAction(type: 'left' | 'right') {
        const el = document.createElement('div')
        const slot = document.createElement('slot')
        slot.name = type
        el.setAttribute('part', `action ${type}`)
        el.appendChild(slot)
        el.style.width = '0'

        return el
    }

    private createContainer() {
        const el = document.createElement('div')
        const slot = document.createElement('slot')
        el.setAttribute('part', 'swipable')
        el.appendChild(slot)

        return el
    }
}

customElements.define('swipable-item', SwipableItem)
import { Databind } from "../databind"

export type WithId = { id: string } & Record<string, any>

export class DynamicList<T extends WithId> extends HTMLElement {
    private _list: T[] = []
    private template?: HTMLTemplateElement
    private internals: ElementInternals

    constructor() {
        super()
        this.internals = this.attachInternals()
        this.internals.role = 'list'
        this.setAttribute('role', 'list')

        this.render()
    }

    get list() {
        return this._list
    }

    set list(newList: T[]) {
        const oldMap = new Map(this._list.map(item => [item.id, item]))
        const newMap = new Map(newList.map(item => [item.id, item]))

        for (const item of newList) {
            if (oldMap.has(item.id)) {
                this._updateItem(item)
            } else {
                this._createItem(item)
            }
        }

        for (const item of this._list) {
            if (!newMap.has(item.id)) {
                this._removeItem(item.id)
            }
        }

        // Reorder <li> wrappers
        for (let i = 0; i < newList.length; i++) {
            const expectedId = newList[i].id
            const currentLi = this.children[i] as HTMLLIElement
            if (!currentLi || currentLi.dataset.id !== expectedId) {
                const correctLi = this.querySelector(`li[data-id="${expectedId}"]`)
                if (correctLi) {
                    this.insertBefore(correctLi, currentLi || null)
                }
            }
        }

        this._list = [...newList]

        this._toggleEmptyData(!!this.list.length)
    }

    disconnectedCallback() {
        this.list = []
    }

    private render() {
        if (this.hasAttribute('aria-label')) {
            this.internals.ariaLabel = 'Dynamic List'
        }
        if (this.hasAttribute('aria-live')) {
            this.internals.ariaLive = 'polite'
        }
        if (this.hasAttribute('aria-relevant')) {
            this.internals.ariaRelevant = 'additions removals'
        }

        const tmpl = this.querySelector('template')
        if (tmpl && tmpl instanceof HTMLTemplateElement) {
            this.template = tmpl
        }

        for (const item of this._list) {
            this._createItem(item)
        }
    }

    private _createItem(data: T) {
        if (!this.template) return

        const clone = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement
        if (!clone) return

        const li = document.createElement('li')
        li.setAttribute('data-id', data.id)
        li.appendChild(clone)
        this.appendChild(li)

        this._setItemData(clone, data)
    }

    private _updateItem(data: T) {
        const li = this.querySelector(`li[data-id="${data.id}"]`)
        const elem = li?.firstElementChild as HTMLElement | null
        if (!elem) return
        this._setItemData(elem, data)
    }

    private _removeItem(id: string) {
        const li = this.querySelector(`li[data-id="${id}"]`)
        li?.remove()
    }

    private _setItemData(elem: HTMLElement, data: T) {
        Databind.updateBindings(elem, data)
    }

    private _toggleEmptyData(isList: boolean) {
        let elem = this.querySelector('.emptyData')
        if (isList) {
            if (elem) elem.remove()
        } else {
            if (!elem) {
                const li = document.createElement('li')
                li.setAttribute('role', 'listitem')
                li.className = 'emptyData'

                li.appendChild(this.emptyEl())
                this.appendChild(li)
            }
        }
    }

    protected emptyEl() {
        const span = document.createElement('span')
        span.textContent = 'No data'
        return span
    }
}

customElements.define('dynamic-list', DynamicList)
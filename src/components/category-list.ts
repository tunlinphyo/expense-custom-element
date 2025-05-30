import { DynamicList } from "../elements/list"

type Filter = {
    id: string
    color: string
    name: string
    icon: string
}

export class CategoryList extends DynamicList<Filter> {
    constructor() {
        super()

        this.setData()
    }

    private setData() {
        const list: Filter[] = [
            {
                id: 'one',
                color: 'green',
                name: 'Grocery',
                icon: 'bio-lock'
            },
            {
                id: 'two',
                color: 'pink',
                name: 'Lunch',
                icon: 'delete-key'
            },
            {
                id: 'three',
                color: 'mint',
                name: 'Food & Drink',
                icon: 'moon'
            },
            {
                id: 'four',
                color: 'orange',
                name: 'Clothing',
                icon: 'home'
            },
            {
                id: 'five',
                color: 'teal',
                name: 'Water',
                icon: 'github'
            },
            {
                id: 'six',
                color: 'purple',
                name: 'Device & Accessories',
                icon: 'bio-lock'
            },
            {
                id: 'seven',
                color: 'green',
                name: 'Power',
                icon: 'bio-lock'
            },
            {
                id: 'eight',
                color: 'blue',
                name: 'Transport',
                icon: 'bio-lock'
            },
        ]
        this.list = list
        this.dispatchEvent(new Event('loaded', {
            bubbles: true,
            cancelable: true
        }))
    }
}

customElements.define('category-list', CategoryList)
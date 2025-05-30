

import { DynamicList } from "../elements/list"

type Filter = {
    id: string
    name: string
}

export class ColorList extends DynamicList<Filter> {
    constructor() {
        super()

        this.setData()
    }

    private setData() {
        const list: Filter[] = [
            {
                id: 'red',
                name: 'Red',
            },
            {
                id: 'orange',
                name: 'Orange',
            },
            {
                id: 'yellow',
                name: 'Yellow',
            },
            {
                id: 'green',
                name: 'Green',
            },
            {
                id: 'mint',
                name: 'Mint',
            },
            {
                id: 'teal',
                name: 'Teal',
            },
            {
                id: 'cyan',
                name: 'Cyan',
            },
            {
                id: 'blue',
                name: 'Blue',
            },
            {
                id: 'indigo',
                name: 'Indigo',
            },
            {
                id: 'purple',
                name: 'Purple',
            },
            {
                id: 'pink',
                name: 'Pink',
            },
            {
                id: 'brown',
                name: 'Brown',
            },
        ]
        this.list = list
    }
}

customElements.define('color-list', ColorList)
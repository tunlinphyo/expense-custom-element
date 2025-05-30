import { DynamicList } from "../../elements/list";

type Filter = {
    id: string
    color: string
    icon: string
}

export class SelectedFilters extends DynamicList<Filter> {
    constructor() {
        super()

        this.setData()
    }

    private setData() {
        const list: Filter[] = [
            {
                id: 'one',
                color: 'green',
                icon: 'home'
            },
            {
                id: 'two',
                color: 'pink',
                icon: 'moon'
            },
            {
                id: 'three',
                color: 'mint',
                icon: 'bio-lock'
            },
        ]
        this.list = list
    }
}

customElements.define('selected-filters', SelectedFilters)
import { DynamicList } from "../../elements/list"

type Expense = {
    id: string
    color: string
    name: string
    date: Date
    amount: number
}

export class ExpenseList extends DynamicList<Expense> {
    constructor() {
        super()

        this.setData()
    }

    private setData() {
        const list: Expense[] = [
            {
                id: 'one',
                color: 'green',
                name: 'Item One',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'two',
                color: 'yellow',
                name: 'Item Two',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'three',
                color: 'mint',
                name: 'Item Three',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'four',
                color: 'red',
                name: 'Item Four',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'five',
                color: 'green',
                name: 'Item Five',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'six',
                color: 'teal',
                name: 'Item Six',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'seven',
                color: 'brown',
                name: 'Item Seven',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'eight',
                color: 'pink',
                name: 'Item Eight',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'nine',
                color: 'blue',
                name: 'Item Nine',
                date: new Date(),
                amount: 2000
            },
            {
                id: 'ten',
                color: 'green',
                name: 'Item Ten',
                date: new Date(),
                amount: 2000
            },
        ]
        this.list = list
    }
}

customElements.define('expense-list', ExpenseList)
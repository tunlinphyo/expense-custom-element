
export class RawHTML {
    constructor(public readonly value: string) {}
}

export function raw(value: string): RawHTML {
    return new RawHTML(value)
}

export function html(strings: TemplateStringsArray, ...values: any[]): Node {
    const template = document.createElement('template')
    const htmlString = strings.reduce((acc, str, i) => {
        const val = values[i];
        if (val instanceof RawHTML) {
            return acc + str + val.value
        } else {
            return acc + str + serialize(val)
        }
    }, '')

    template.innerHTML = htmlString
    return template.content.cloneNode(true)
}

export function css(strings: TemplateStringsArray, ...values: any[]): CSSStyleSheet {
    const cssString = strings.reduce((acc, str, i) => {
        const val = values[i]
        return acc + str + serialize(val)
    }, '')

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(cssString)

    return sheet
}

export function serialize(value: any): string {
    if (value == null) return ''
    return String(value)
        .replace(/&/g, '&amp')
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/"/g, '&quot')
        .replace(/'/g, '&#039')
}

export function deepEqual(a: any, b: any): boolean {
    if (a === b) return true

    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null)
        return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false
    }

    return true
}
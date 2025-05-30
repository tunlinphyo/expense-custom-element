import { ContextConsumer, ContextProvider, createContext } from '../../context'
import { Databind } from '../databind'
import { deepEqual } from '../utils'
import {
    collectInitialFormData,
    type FormDataType,
    parseFormValue,
    resetFormValues,
    setFormValues
} from "./form-utils"

export const formContext = createContext<FormDataType>('form-context')

export class CustomForm extends HTMLElement {
    static formAssociated = true

    private internals: ElementInternals
    private provider!: ContextProvider<FormDataType>
    private consumer!: ContextConsumer<FormDataType>
    private formData: FormDataType = {}
    private initData: FormDataType = {}

    private boundOnInput = this._onInput.bind(this)
    private boundOnClick = this._onClick.bind(this)
    private boundOnKeydown = this._onKeydown.bind(this)

    get dirty(): boolean {
        return !deepEqual(this.formData, this.initData)
    }

    get data() {
        return this.formData
    }
    set data(formData: FormDataType) {
        this.initData = { ...formData }
        this.formData = { ...formData }
        this.provider.setValue(formData)
        setFormValues(this, this.initData)
        this.setFormValueFromData()
    }

    constructor() {
        super()
        this.internals = this.attachInternals()
        this.internals.role = 'form'
        this.setAttribute('role', 'form')
    }

    connectedCallback(): void {
        this.formData = collectInitialFormData(this)
        this.initData = { ...this.formData }

        this.provider = new ContextProvider(this, formContext, {
            initial: this.formData
        })

        this.consumer = new ContextConsumer(this, formContext)
        this.consumer.subscribe((form, oldForm) => {
            Databind.updateBindings(this, form, oldForm)
            setFormValues(this, form)
            this._updateDirtyAttribute()
        })

        this.addEventListener('input', this.boundOnInput, true)
        this.addEventListener('click', this.boundOnClick, true)
        this.addEventListener('keydown', this.boundOnKeydown, true)

        this.setFormValueFromData()
    }

    disconnectedCallback() {
        this.removeEventListener('input', this.boundOnInput, true)
        this.removeEventListener('click', this.boundOnClick, true)
        this.removeEventListener('keydown', this.boundOnKeydown, true)
        this.consumer.unsubscribe()
    }

    getInitData() {
        return this.initData
    }

    setFormData(formData: FormDataType) {
        this.data = formData
    }

    getFormData(): FormDataType {
        return this.formData
    }

    submit(): void {
        const event = new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: null })
        this.dispatchEvent(event)

        console.log(this.getFormData())
    }

    requestSubmit(submitter?: HTMLElement): void {
        if (this.checkValidity()) {
            const event = new SubmitEvent('submit', {
                bubbles: true,
                cancelable: true,
                submitter: submitter || null
            })
            this.dispatchEvent(event)
        } else {
            this.reportValidity()
        }
    }

    checkValidity(): boolean {
        const elements = this.querySelectorAll<HTMLElement>('*')
        return Array.from(elements).every(el => {
            return typeof (el as any).checkValidity === 'function'
                ? (el as any).checkValidity()
                : true
        })
    }

    reportValidity(): boolean {
        const elements = this.querySelectorAll<HTMLElement>('*')
        return Array.from(elements).every(el => {
            return typeof (el as any).reportValidity === 'function'
                ? (el as any).reportValidity()
                : true
        })
    }

    reset() {
        const event = new Event('reset', { bubbles: true, cancelable: true })
        if (this.dispatchEvent(event)) {
            this.data = this.initData
        }
    }

    clear() {
        this.initData = {}
        this.formData = {}
        this.provider.setValue(this.formData)
        resetFormValues(this)
        this.internals.setFormValue(new FormData())
    }

    protected updateFormdata(formData: FormDataType) {
        this.formData = { ...this.formData, ...formData }
        this.provider.setValue(this.formData)
        this.setFormValueFromData()
    }

    private setFormValueFromData() {
        const data = new FormData()
        for (const [key, value] of Object.entries(this.formData)) {
            if (Array.isArray(value)) {
                value.forEach(v => data.append(key, String(v)))
            } else {
                data.append(key, String(value))
            }
        }
        this.internals.setFormValue(data)
    }

    private _onInput(e: Event): void {
        const el = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        const name = el.name
        if (!name) return

        const value = parseFormValue(el)
        if (value === null) return

        const formObj: FormDataType = {}
        formObj[name] = value
        if (el.dataset.sync) {
            const keys = el.dataset.sync.split(':')
            for (const key of keys) {
                formObj[key] = el.dataset[key] || ''
            }
        }
        this.formData = { ...this.formData, ...formObj }
        this.provider.setValue(this.formData)
        this.setFormValueFromData()
    }

    private _onClick(e: MouseEvent): void {
        const target = e.target as HTMLElement
        if (target instanceof HTMLButtonElement) {
            if (target.type === 'submit') {
                this.submit()
            } else if (target.type === 'reset') {
                this.reset()
            }
        }
    }

    private _onKeydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            const active = document.activeElement as HTMLElement
            if (active?.tagName === 'TEXTAREA') return // ignore multiline
            if (this.contains(active)) {
                this.submit()
            }
        }
    }

    private _updateDirtyAttribute(): void {
        const isDirty = this.dirty
        if (isDirty) {
            this.setAttribute('dirty', 'true')
        } else {
            this.removeAttribute('dirty')
        }
    }
}

customElements.define('custom-form', CustomForm)
import type { CustomModal, CustomPage } from "../elements"


export class Helper {
    public static buttonClickHandler(e: Event) {
        const target = e.target as HTMLElement

        if (target.hasAttribute('data-button')) {
            const key = target.dataset.button 
            const id = target.dataset.target 
            
            if (key === 'open-modal' && id) {
                const elem = document.getElementById(id) as CustomModal
                elem?.openModal()
            }

            if (key === 'close-modal' && id) {
                const elem = document.getElementById(id) as CustomModal
                elem?.closeModal()
            }

            if (key === 'open-page' && id) {
                const elem = document.getElementById(id) as CustomPage
                elem?.openPage()
            }

            if (key === 'close-page' && id) {
                const elem = document.getElementById(id) as CustomPage
                elem?.closePage()
            }
        }
    }
}
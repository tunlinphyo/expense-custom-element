export class Animator {
    public static openModal(elem: HTMLElement, y: number = 0) {
        return elem.animate([
            { transform: `translateY(${y || elem.clientHeight}px)` },
            { transform: `translateY(0)` },
        ], {
            duration: 700,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        })
    }

    public static setModal(elem: HTMLElement, y: number = 0) {
        return elem.animate([
            { transform: `translateY(${y}px)` },
            { transform: `translateY(0)` },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        })
    }

    public static closeModal(elem: HTMLElement, y: number = 0) {
        return elem.animate([
            { transform: `translateY(${y}px)` },
            { transform: `translateY(${elem.clientHeight}px)` },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        })
    }

    public static setPage(elem: HTMLElement, x: number = 0) {
        return elem.animate([
            { transform: `translateX(${x}px)` },
            { transform: `translateX(0)` },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        })
    }

    public static openPage(elem: HTMLElement, x: number = 0) {
        return elem.animate([
            { transform: `translateX(${x || elem.clientWidth}px)` },
            { transform: `translateX(0)` },
        ], {
            duration: 700,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        })
    }

    public static closePage(elem: HTMLElement, x: number = 0) {
        return elem.animate([
            { transform: `translateX(${x}px)` },
            { transform: `translateX(${elem.clientWidth}px)` },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        })
    }

    public static openSelect(elem: HTMLElement) {
        return elem.animate([
            { transform: `translateY(${elem.clientHeight + 40}px)` },
            { transform: `translateY(0)` },
        ], {
            duration: 700,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        })
    }

    public static closeSelect(elem: HTMLElement) {
        return elem.animate([
            { transform: `translateY(0)` },
            { transform: `translateY(${elem.clientHeight + 40}px)` },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        })
    }
}
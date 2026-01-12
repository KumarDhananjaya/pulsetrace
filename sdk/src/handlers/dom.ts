import { PulseTrace } from '../core';

export function setupDomHandlers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('click', (event) => {
        try {
            const target = event.target as HTMLElement;
            if (!target) return;

            const breadcrumb = {
                type: 'user',
                category: 'ui.click',
                message: `Clicked ${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}${target.className ? `.${target.className.split(' ').join('.')}` : ''}`,
                data: {
                    tagName: target.tagName,
                    id: target.id,
                    classList: Array.from(target.classList),
                    text: target.innerText?.substring(0, 100),
                },
            };

            PulseTrace.addBreadcrumb(breadcrumb);
        } catch (e) {
            // Ignore click tracking errors
        }
    }, true);
}

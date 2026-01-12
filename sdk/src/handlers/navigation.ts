import { PulseTrace } from '../core';

export function setupNavigationHandlers() {
    if (typeof window === 'undefined') return;

    // 1. Capture Popstate (back/forward)
    window.addEventListener('popstate', () => {
        PulseTrace.addBreadcrumb({
            type: 'navigation',
            category: 'navigation.popstate',
            message: `Navigated to ${window.location.pathname}`,
        });
    });

    // 2. Capture pushState (programmatic navigation)
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
        const url = args[2];
        PulseTrace.addBreadcrumb({
            type: 'navigation',
            category: 'navigation.pushState',
            message: `Navigated to ${url}`,
        });
        return originalPushState.apply(this, args);
    };
}

export function getContexts() {
    if (typeof window === 'undefined') return {};

    return {
        os: getOS(),
        browser: getBrowser(),
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            density: window.devicePixelRatio || 1
        },
        locale: navigator.language,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

function getOS() {
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return { name: 'Windows', version: '' };
    if (/Mac/i.test(ua)) return { name: 'Mac OS', version: '' };
    if (/Linux/i.test(ua)) return { name: 'Linux', version: '' };
    if (/Android/i.test(ua)) return { name: 'Android', version: '' };
    if (/iOS|iPhone|iPad|iPod/i.test(ua)) return { name: 'iOS', version: '' };
    return { name: 'Unknown', version: '' };
}

function getBrowser() {
    const ua = navigator.userAgent;
    if (/Chrome/i.test(ua)) return { name: 'Chrome', version: '' };
    if (/Firefox/i.test(ua)) return { name: 'Firefox', version: '' };
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return { name: 'Safari', version: '' };
    if (/Edge/i.test(ua)) return { name: 'Edge', version: '' };
    return { name: 'Unknown', version: '' };
}

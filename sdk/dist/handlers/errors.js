"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandlers = setupErrorHandlers;
const core_1 = require("../core");
function setupErrorHandlers() {
    if (typeof window === 'undefined')
        return;
    window.onerror = (msg, src, line, col, error) => {
        core_1.PulseTrace.captureException(error || new Error(String(msg)), {
            extra: { src, line, col }
        });
        return false;
    };
    window.onunhandledrejection = (event) => {
        const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        core_1.PulseTrace.captureException(error, { level: 'error' });
    };
}

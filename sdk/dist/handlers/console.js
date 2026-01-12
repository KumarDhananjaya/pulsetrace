"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupConsoleHandlers = setupConsoleHandlers;
const core_1 = require("../core");
function setupConsoleHandlers() {
    const originalError = console.error;
    console.error = (...args) => {
        originalError.apply(console, args);
        try {
            const message = args.map(a => a instanceof Error ? a.message : String(a)).join(' ');
            const error = args.find(a => a instanceof Error);
            core_1.PulseTrace.captureException(error || new Error(message), { level: 'error' });
        }
        catch (e) { }
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulseTrace = void 0;
const transport_1 = require("./transport");
const console_1 = require("./handlers/console");
const errors_1 = require("./handlers/errors");
class PulseTrace {
    constructor() {
        this.initialized = false;
    }
    static init(config) {
        const pt = this.getInstance();
        if (pt.initialized)
            return;
        pt.config = config;
        pt.transport = new transport_1.Transport(config.dsn);
        pt.initialized = true;
        (0, console_1.setupConsoleHandlers)();
        (0, errors_1.setupErrorHandlers)();
        if (config.debug)
            console.log('PulseTrace SDK Initialized');
    }
    static captureException(error, options = {}) {
        const pt = this.getInstance();
        if (!pt.initialized)
            return;
        const event = {
            event_id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
            timestamp: Date.now(),
            platform: 'javascript',
            level: options.level || 'error',
            message: error.message,
            exception: {
                type: error.name,
                value: error.message,
                stacktrace: error.stack
            },
            environment: pt.config.environment,
            release: pt.config.release,
            extra: options.extra
        };
        pt.transport.sendEvent(event);
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new PulseTrace();
        return this.instance;
    }
}
exports.PulseTrace = PulseTrace;

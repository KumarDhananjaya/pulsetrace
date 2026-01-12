"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transport = void 0;
class Transport {
    constructor(dsn) {
        this.dsn = dsn;
    }
    async sendEvent(event) {
        console.log('[PulseTrace] Sending event to:', this.dsn, event);
        // Future: fetch or sendBeacon
    }
}
exports.Transport = Transport;

import { PulseEvent } from './types';

export class Transport {
    constructor(private dsn: string) { }

    public async sendEvent(event: PulseEvent): Promise<void> {
        console.log('[PulseTrace] Sending event to:', this.dsn, event);
        // Future: fetch or sendBeacon
    }
}

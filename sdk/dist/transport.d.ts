import { PulseEvent } from './types';
export declare class Transport {
    private dsn;
    constructor(dsn: string);
    sendEvent(event: PulseEvent): Promise<void>;
}

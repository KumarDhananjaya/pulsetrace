import { PulseConfig } from './types';
export declare class PulseTrace {
    private static instance;
    private initialized;
    private config;
    private transport;
    static init(config: PulseConfig): void;
    static captureException(error: Error, options?: any): void;
    private static getInstance;
}

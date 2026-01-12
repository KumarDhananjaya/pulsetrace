import { PulseTrace } from './core';

export const init = PulseTrace.init.bind(PulseTrace);
export const captureException = PulseTrace.captureException.bind(PulseTrace);

export default { init, captureException };

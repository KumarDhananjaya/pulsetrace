"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureException = exports.init = void 0;
const core_1 = require("./core");
exports.init = core_1.PulseTrace.init.bind(core_1.PulseTrace);
exports.captureException = core_1.PulseTrace.captureException.bind(core_1.PulseTrace);
exports.default = { init: exports.init, captureException: exports.captureException };

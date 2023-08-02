var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/runtime"], function (require, exports, runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAuthenticationToken = void 0;
    runtime_1 = __importDefault(runtime_1);
    var getAuthenticationToken = function () {
        try {
            return runtime_1.default.getCurrentScript().getParameter({ name: 'custscript_clin_integration_token' });
        }
        catch (e) {
            throw e;
        }
    };
    exports.getAuthenticationToken = getAuthenticationToken;
});

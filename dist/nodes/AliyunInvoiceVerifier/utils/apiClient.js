"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.createOcrClient = createOcrClient;
exports.verifyInvoice = verifyInvoice;
const credentials_1 = __importDefault(require("@alicloud/credentials"));
const ocr_api20210707_1 = __importStar(require("@alicloud/ocr-api20210707")), $ocr_api20210707 = ocr_api20210707_1;
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const $Util = __importStar(require("@alicloud/tea-util"));
class ApiError extends Error {
    code;
    requestId;
    constructor(message, code, requestId) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.requestId = requestId;
    }
}
exports.ApiError = ApiError;
const ERROR_CODE_MAP = {
    'InvalidAccessKeyId.NotFound': '请检查 AccessKey ID 是否正确',
    'SignatureDoesNotMatch': '请检查 AccessKey Secret 是否正确',
    'Forbidden.RAM': '请为该 RAM 用户授予 OCR 服务权限',
    'InvalidParameter': '请检查输入参数是否符合要求',
    'Throttling.User': '请求频率过高，请稍后重试',
    'InvoiceNotFound': '发票信息不存在或尚未上传到税务系统',
    'InvalidInvoiceCode': '发票代码错误',
    'InvalidInvoiceNumber': '发票号码错误',
    'InvalidVerifyCode': '校验码错误',
    'ServiceUnavailable': '服务暂时不可用，请稍后重试',
    'InternalError': '服务内部错误，请稍后重试',
};
function createOcrClient(credentials) {
    try {
        process.env.ALIBABA_CLOUD_ACCESS_KEY_ID = credentials.accessKeyId;
        process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET = credentials.accessKeySecret;
        const credential = new credentials_1.default();
        const config = new $OpenApi.Config({
            credential: credential,
        });
        config.endpoint = credentials.endpoint || 'ocr-api.cn-hangzhou.aliyuncs.com';
        return new ocr_api20210707_1.default(config);
    }
    catch (error) {
        throw new ApiError(`创建阿里云 API 客户端失败: ${error.message}`);
    }
}
async function verifyInvoice(credentials, params) {
    try {
        const client = createOcrClient(credentials);
        const request = new $ocr_api20210707.VerifyVATInvoiceRequest({
            invoiceCode: params.invoiceCode,
            invoiceNo: params.invoiceNo,
            invoiceDate: params.invoiceDate,
            invoiceSum: params.invoiceSum,
            verifyCode: params.verifyCode,
            invoiceKind: params.invoiceKind?.toString(),
        });
        const runtime = new $Util.RuntimeOptions({});
        const response = await client.verifyVATInvoiceWithOptions(request, runtime);
        if (!response || !response.body) {
            throw new ApiError('API 返回数据为空');
        }
        const requestId = response.body.requestId || '';
        const dataString = response.body.data || '{}';
        let responseData;
        try {
            responseData = JSON.parse(dataString);
        }
        catch (parseError) {
            throw new ApiError(`解析 API 响应数据失败: ${parseError.message}`, undefined, requestId);
        }
        return {
            requestId,
            data: responseData,
        };
    }
    catch (error) {
        if (error.name === 'ApiError') {
            throw error;
        }
        const errorCode = error.code || error.name;
        const friendlyMessage = ERROR_CODE_MAP[errorCode] || error.message;
        const requestId = error.data?.RequestId || error.requestId;
        if (error.name === 'NetworkError' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            throw new ApiError('网络连接失败，请检查网络设置', 'NetworkError', requestId);
        }
        throw new ApiError(`阿里云 API 调用失败: ${friendlyMessage}`, errorCode, requestId);
    }
}
//# sourceMappingURL=apiClient.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliyunInvoiceVerifierApi = void 0;
class AliyunInvoiceVerifierApi {
    name = 'aliyunInvoiceVerifierApi';
    displayName = '阿里云发票核验 API';
    documentationUrl = 'https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifyvatinvoice';
    properties = [
        {
            displayName: 'AccessKey ID',
            name: 'accessKeyId',
            type: 'string',
            default: '',
            required: true,
            description: '阿里云 AccessKey ID。请访问 <a href="https://usercenter.console.aliyun.com/#/manage/ak" target="_blank">阿里云控制台</a> 获取。',
        },
        {
            displayName: 'AccessKey Secret',
            name: 'accessKeySecret',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: '阿里云 AccessKey Secret',
        },
        {
            displayName: 'API 端点',
            name: 'endpoint',
            type: 'string',
            default: 'ocr-api.cn-hangzhou.aliyuncs.com',
            required: false,
            description: '阿里云 OCR API 端点地址。默认：ocr-api.cn-hangzhou.aliyuncs.com',
            placeholder: 'ocr-api.cn-hangzhou.aliyuncs.com',
        },
    ];
}
exports.AliyunInvoiceVerifierApi = AliyunInvoiceVerifierApi;
//# sourceMappingURL=AliyunInvoiceVerifierApi.credentials.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliyunInvoiceVerifier = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const invoice_types_1 = require("./types/invoice.types");
const validator_1 = require("./utils/validator");
const apiClient_1 = require("./utils/apiClient");
const formatter_1 = require("./utils/formatter");
class AliyunInvoiceVerifier {
    description = {
        displayName: '阿里云发票核验',
        name: 'aliyunInvoiceVerifier',
        icon: 'file:aliyun-invoice-verifier.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: '通过阿里云 API 验证增值税发票的真伪',
        defaults: {
            name: '阿里云发票核验',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'aliyunInvoiceVerifierApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: '发票代码',
                name: 'invoiceCode',
                type: 'string',
                default: '',
                placeholder: '011001801234',
                description: '发票代码（10-12位数字）。数电发票（类型代码31、32）时可为空。',
            },
            {
                displayName: '发票号码',
                name: 'invoiceNo',
                type: 'string',
                default: '',
                required: true,
                placeholder: '35314567',
                description: '发票号码（8-20位数字，不同类型发票位数不同）',
            },
            {
                displayName: '开票日期',
                name: 'invoiceDate',
                type: 'string',
                default: '',
                required: true,
                placeholder: '20231015',
                description: '开票日期，格式：YYYYMMDD（例如：20231015）',
            },
            {
                displayName: '发票金额',
                name: 'invoiceSum',
                type: 'string',
                default: '',
                placeholder: '322.33',
                description: '发票金额。根据发票类型填写：类型01、03、20填写不含税金额；类型15填写车价合计；类型31、32填写含税金额；区块链发票填写不含税金额。',
            },
            {
                displayName: '校验码',
                name: 'verifyCode',
                type: 'string',
                default: '',
                placeholder: '123456',
                description: '校验码后6位。发票类型04、10、11、14时必填，区块链发票时必填。',
            },
            {
                displayName: '发票类型',
                name: 'invoiceKind',
                type: 'options',
                options: [
                    {
                        name: '普通发票',
                        value: invoice_types_1.InvoiceKind.Normal,
                        description: '增值税专用发票、普通发票、数电发票等',
                    },
                    {
                        name: '区块链发票',
                        value: invoice_types_1.InvoiceKind.Blockchain,
                        description: '区块链发票（所有参数均为必填）',
                    },
                ],
                default: invoice_types_1.InvoiceKind.Normal,
                description: '选择发票类型。区块链发票时，所有参数均为必填。',
            },
            {
                displayName: '失败时继续',
                name: 'continueOnFail',
                type: 'boolean',
                default: false,
                description: '当发票核验失败时是否继续执行下一项。启用后，错误信息会包含在输出中。',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let credentials;
        try {
            credentials = await this.getCredentials('aliyunInvoiceVerifierApi');
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), '无法获取阿里云凭证配置，请检查凭证是否正确设置');
        }
        for (let i = 0; i < length; i++) {
            try {
                const invoiceCode = this.getNodeParameter('invoiceCode', i, '');
                const invoiceNo = this.getNodeParameter('invoiceNo', i);
                const invoiceDate = this.getNodeParameter('invoiceDate', i);
                const invoiceSum = this.getNodeParameter('invoiceSum', i, '');
                const verifyCode = this.getNodeParameter('verifyCode', i, '');
                const invoiceKind = this.getNodeParameter('invoiceKind', i, invoice_types_1.InvoiceKind.Normal);
                const params = {
                    invoiceCode: invoiceCode || undefined,
                    invoiceNo,
                    invoiceDate,
                    invoiceSum: invoiceSum || undefined,
                    verifyCode: verifyCode || undefined,
                    invoiceKind,
                };
                try {
                    (0, validator_1.validateInvoiceParams)(params);
                }
                catch (validationError) {
                    if (validationError instanceof validator_1.ValidationError) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `参数验证失败: ${validationError.message}`, { itemIndex: i });
                    }
                    throw validationError;
                }
                let apiResponse;
                try {
                    apiResponse = await (0, apiClient_1.verifyInvoice)(credentials, params);
                }
                catch (apiError) {
                    if (apiError instanceof apiClient_1.ApiError) {
                        const errorMessage = apiError.requestId
                            ? `${apiError.message} (RequestId: ${apiError.requestId})`
                            : apiError.message;
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
                    }
                    throw apiError;
                }
                const result = (0, formatter_1.formatInvoiceVerifyResult)(apiResponse.requestId, apiResponse.data);
                returnData.push({
                    json: result,
                    pairedItem: { item: i },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: (0, formatter_1.formatErrorResult)(error),
                        pairedItem: { item: i },
                    });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw error;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `发票核验失败: ${error.message}`, { itemIndex: i });
            }
        }
        return [returnData];
    }
}
exports.AliyunInvoiceVerifier = AliyunInvoiceVerifier;
//# sourceMappingURL=AliyunInvoiceVerifier.node.js.map
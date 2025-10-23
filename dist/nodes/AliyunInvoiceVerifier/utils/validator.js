"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateInvoiceNo = validateInvoiceNo;
exports.validateInvoiceDate = validateInvoiceDate;
exports.validateInvoiceCode = validateInvoiceCode;
exports.validateInvoiceSum = validateInvoiceSum;
exports.validateVerifyCode = validateVerifyCode;
exports.validateInvoiceKind = validateInvoiceKind;
exports.validateInvoiceParams = validateInvoiceParams;
const invoice_types_1 = require("../types/invoice.types");
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateInvoiceNo(invoiceNo) {
    if (!invoiceNo) {
        throw new ValidationError('发票号码不能为空');
    }
    if (!/^\d{8,20}$/.test(invoiceNo)) {
        throw new ValidationError('发票号码格式错误，应为 8-20 位数字');
    }
}
function validateInvoiceDate(invoiceDate) {
    if (!invoiceDate) {
        throw new ValidationError('开票日期不能为空');
    }
    if (!/^\d{8}$/.test(invoiceDate)) {
        throw new ValidationError('开票日期格式错误，应为 YYYYMMDD 格式（如：20231015）');
    }
    const year = parseInt(invoiceDate.substring(0, 4), 10);
    const month = parseInt(invoiceDate.substring(4, 6), 10);
    const day = parseInt(invoiceDate.substring(6, 8), 10);
    if (year < 2000 || year > 2099) {
        throw new ValidationError('开票日期年份应在 2000-2099 之间');
    }
    if (month < 1 || month > 12) {
        throw new ValidationError('开票日期月份应在 01-12 之间');
    }
    if (day < 1 || day > 31) {
        throw new ValidationError('开票日期日期应在 01-31 之间');
    }
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day) {
        throw new ValidationError('开票日期无效，请检查日期是否正确');
    }
}
function validateInvoiceCode(invoiceCode) {
    if (!invoiceCode) {
        return;
    }
    if (!/^\d{10,12}$/.test(invoiceCode)) {
        throw new ValidationError('发票代码格式错误，应为 10-12 位数字');
    }
}
function validateInvoiceSum(invoiceSum) {
    if (!invoiceSum) {
        return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(invoiceSum)) {
        throw new ValidationError('发票金额格式错误，应为数字且最多两位小数（如：322.33）');
    }
    const amount = parseFloat(invoiceSum);
    if (amount <= 0) {
        throw new ValidationError('发票金额必须大于 0');
    }
}
function validateVerifyCode(verifyCode) {
    if (!verifyCode) {
        return;
    }
    if (verifyCode.length !== 6) {
        throw new ValidationError('校验码应为 6 位（取发票校验码后 6 位）');
    }
    if (!/^[0-9a-zA-Z]{6}$/.test(verifyCode)) {
        throw new ValidationError('校验码格式错误，应为 6 位数字或字母');
    }
}
function validateInvoiceKind(invoiceKind) {
    if (invoiceKind !== invoice_types_1.InvoiceKind.Normal && invoiceKind !== invoice_types_1.InvoiceKind.Blockchain) {
        throw new ValidationError('发票类型只能是 0（普通发票）或 1（区块链发票）');
    }
}
function validateInvoiceParams(params) {
    validateInvoiceNo(params.invoiceNo);
    validateInvoiceDate(params.invoiceDate);
    if (params.invoiceCode) {
        validateInvoiceCode(params.invoiceCode);
    }
    if (params.invoiceSum) {
        validateInvoiceSum(params.invoiceSum);
    }
    if (params.verifyCode) {
        validateVerifyCode(params.verifyCode);
    }
    if (params.invoiceKind !== undefined) {
        validateInvoiceKind(params.invoiceKind);
    }
    if (params.invoiceKind === invoice_types_1.InvoiceKind.Blockchain) {
        if (!params.invoiceCode) {
            throw new ValidationError('区块链发票必须填写发票代码');
        }
        if (!params.invoiceSum) {
            throw new ValidationError('区块链发票必须填写发票金额');
        }
        if (!params.verifyCode) {
            throw new ValidationError('区块链发票必须填写校验码');
        }
    }
}
//# sourceMappingURL=validator.js.map
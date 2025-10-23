"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidMarkDescription = getInvalidMarkDescription;
exports.getInvoiceTypeDescription = getInvoiceTypeDescription;
exports.getResponseCodeDescription = getResponseCodeDescription;
exports.isSuccessCode = isSuccessCode;
exports.isChargedCode = isChargedCode;
exports.formatInvoiceVerifyResult = formatInvoiceVerifyResult;
exports.formatErrorResult = formatErrorResult;
function formatPurchaserInfo(rawData) {
    if (!rawData) {
        return {
            name: '',
            taxNumber: '',
            addressOrPhone: '',
            bankAndNumber: '',
        };
    }
    return {
        name: rawData.purchaserName || '',
        taxNumber: rawData.purchaserTaxpayerNumber || '',
        addressOrPhone: rawData.purchaserAddressOrPhone || '',
        bankAndNumber: rawData.purchaserBankAndNumber || '',
    };
}
function formatSalerInfo(rawData) {
    if (!rawData) {
        return {
            name: '',
            taxNumber: '',
            addressOrPhone: '',
            bankAndNumber: '',
        };
    }
    return {
        name: rawData.salerName || '',
        taxNumber: rawData.salerTaxpayerNumber || '',
        addressOrPhone: rawData.salerAddressOrPhone || '',
        bankAndNumber: rawData.salerBankAndNumber || '',
    };
}
function formatDetailList(detailList) {
    if (!detailList || !Array.isArray(detailList) || detailList.length === 0) {
        return undefined;
    }
    return detailList.map((detail) => ({
        rowNo: detail.rowNo || '',
        detailNo: detail.detailNo || '',
        goodsName: detail.goodsName || '',
        standard: detail.standard || '',
        unit: detail.unit || '',
        num: detail.num || '',
        netValue: detail.netValue || '',
        detailAmount: detail.detailAmount || '',
        taxRate: detail.taxRate || '',
        allTax: detail.allTax || '',
        taxClassifyCode: detail.taxClassifyCode || '',
        expenseItem: detail.expenseItem || '',
        plate_no: detail.plate_no || '',
        trafficDateStart: detail.trafficDateStart || '',
        trafficDateEnd: detail.trafficDateEnd || '',
        type: detail.type || '',
        taxUnitPrice: detail.taxUnitPrice || '',
        taxDetailAmount: detail.taxDetailAmount || '',
    }));
}
function getInvalidMarkDescription(invalidMark) {
    const markMap = {
        'N': '未作废（正常）',
        'Y': '已作废',
        'H': '冲红',
        '7': '部分冲红',
        '8': '全额冲红',
    };
    return markMap[invalidMark] || invalidMark;
}
function getInvoiceTypeDescription(invoiceType) {
    const typeMap = {
        '01': '增值税专用发票',
        '03': '机动车销售统一发票（专用）',
        '04': '增值税普通发票（卷票）',
        '10': '增值税电子普通发票',
        '11': '增值税普通发票',
        '14': '通行费增值税电子普通发票',
        '15': '二手车销售统一发票',
        '20': '机动车销售统一发票',
        '31': '数电发票（专用发票）',
        '32': '数电发票（普通发票）',
    };
    return typeMap[invoiceType] || `发票类型代码: ${invoiceType}`;
}
const RESPONSE_CODE_MAP = {
    '001': { description: '成功', charged: true },
    '000000': { description: '成功', charged: true },
    '006': { description: '发票信息不一致', charged: true },
    '009': { description: '所查发票不存在', charged: true },
    '1005': { description: '请核对四要素是否符合发票规范', charged: true },
    '002': { description: '超过该张票当天查验次数', charged: false },
    '104': { description: '已超过最大查验量', charged: false },
    '10017': { description: '超过五年的不能查验', charged: false },
    '10014': { description: '日期当天不能查验', charged: false },
    '115': { description: '超过服务有效期限限制', charged: false },
    '005': { description: '请求不合法', charged: false },
    '105': { description: '查询发票不规范（参数不完整、发票类型不支持或发票无效）', charged: false },
    '108': { description: '参数不为空', charged: false },
    '109': { description: '参数长度不正确', charged: false },
    '110': { description: '参数"InvoiceCode"的格式或取值范围错误', charged: false },
    '111': { description: '参数"InvoiceSum"的格式或取值范围错误', charged: false },
    '112': { description: '参数"VerifyCode"的格式或取值范围错误', charged: false },
    '113': { description: '参数"InvoiceNo"的格式或取值范围错误', charged: false },
    '114': { description: '校验码不正确，应为后六位', charged: false },
    '1010': { description: '日期格式不正确(请检查日期是否符合格式 YYYYMMDD)', charged: false },
    '1011': { description: '请求参数不完整', charged: false },
    '10015': { description: '开票金额：不合法的格式', charged: false },
    '10016': { description: '检验码：不能为空', charged: false },
    '10018': { description: '检验码：不合法的长度', charged: false },
    '111000': { description: '参数不能为空', charged: false },
    '111001': { description: '参数格式不正确', charged: false },
    '106': { description: '查验异常', charged: false },
    '1021': { description: '网络超时，税局升级维护', charged: false },
    '000001': { description: '查询无数据', charged: false },
    '101000': { description: '系统异常', charged: false },
    '121000': { description: '内部处理失败', charged: false },
    '121001': { description: '内部处理限流', charged: false },
    '121002': { description: '内部处理超时', charged: false },
    '171000': { description: '数据源业务异常', charged: false },
    '10020': { description: '没有查验权限', charged: false },
    '131002': { description: '接口无权限', charged: false },
    '131003': { description: '接口调用次数过限', charged: false },
    '131004': { description: '接口已到期', charged: false },
    '131005': { description: '接口调用频率过高', charged: false },
    '152000': { description: '超过用户 QPS 调用阈值', charged: false },
};
function getResponseCodeDescription(code) {
    const info = RESPONSE_CODE_MAP[code];
    return info ? info.description : `未知响应码: ${code}`;
}
function isSuccessCode(code) {
    return code === '001' || code === '000000';
}
function isChargedCode(code) {
    const info = RESPONSE_CODE_MAP[code];
    return info ? info.charged : false;
}
function formatInvoiceVerifyResult(requestId, apiResponse) {
    const rawData = apiResponse.data || {};
    const code = apiResponse.code || '';
    const isSuccess = isSuccessCode(code);
    const result = {
        success: isSuccess,
        requestId,
        responseCode: code,
        responseMessage: apiResponse.msg || '',
        responseDescription: getResponseCodeDescription(code),
        charged: isChargedCode(code),
        invoice: {
            invoiceType: rawData?.invoiceType || '',
            invoiceCode: rawData?.invoiceCode || '',
            invoiceNumber: rawData?.invoiceNumber || '',
            invoiceDate: rawData?.invoiceDate || '',
            checkCode: rawData?.checkCode || '',
            verificationResult: rawData?.cyjgxx || '',
            inspectionAmount: rawData?.inspectionAmount || '',
            invalidMark: rawData?.invalidMark || '',
            invalidMarkDescription: getInvalidMarkDescription(rawData?.invalidMark || ''),
            invoiceMoney: rawData?.invoiceMoney || '',
            allTax: rawData?.allTax || '',
            allValoremTax: rawData?.allValoremTax || '',
            purchaser: formatPurchaserInfo(rawData),
            saler: formatSalerInfo(rawData),
            details: formatDetailList(rawData?.detailList),
            machineCode: rawData?.machineCode,
            note: rawData?.note,
        },
    };
    return result;
}
function formatErrorResult(error, requestId) {
    return {
        success: false,
        requestId: requestId || '',
        error: {
            message: error.message || '未知错误',
            code: error.code || 'UNKNOWN_ERROR',
            name: error.name || 'Error',
        },
    };
}
//# sourceMappingURL=formatter.js.map
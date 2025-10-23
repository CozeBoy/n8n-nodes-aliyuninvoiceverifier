export declare enum InvoiceKind {
    Normal = 0,
    Blockchain = 1
}
export declare enum InvalidMark {
    Normal = "N",
    Invalid = "Y",
    RedFlushed = "H",
    PartialRedFlushed = "7",
    FullRedFlushed = "8"
}
export interface IInvoiceVerifyRequest {
    invoiceCode?: string;
    invoiceNo: string;
    invoiceDate: string;
    invoiceSum?: string;
    verifyCode?: string;
    invoiceKind?: InvoiceKind;
}
export interface IInvoiceDetail {
    rowNo: string;
    detailNo: string;
    goodsName: string;
    standard: string;
    unit: string;
    num: string;
    netValue: string;
    detailAmount: string;
    taxRate: string;
    allTax: string;
    taxClassifyCode: string;
    expenseItem: string;
    plate_no: string;
    trafficDateStart: string;
    trafficDateEnd: string;
    type: string;
    taxUnitPrice: string;
    taxDetailAmount: string;
}
export interface IPurchaserInfo {
    name: string;
    taxNumber: string;
    addressOrPhone: string;
    bankAndNumber: string;
}
export interface ISalerInfo {
    name: string;
    taxNumber: string;
    addressOrPhone: string;
    bankAndNumber: string;
}
export interface IInvoiceRawData {
    invoiceType: string;
    invoiceCode: string;
    invoiceNumber: string;
    invoiceDate: string;
    checkCode: string;
    cyjgxx: string;
    inspectionAmount: string;
    invalidMark: string;
    invoiceMoney: string;
    allTax: string;
    allValoremTax: string;
    purchaserName: string;
    purchaserTaxpayerNumber: string;
    purchaserAddressOrPhone: string;
    purchaserBankAndNumber: string;
    salerName: string;
    salerTaxpayerNumber: string;
    salerAddressOrPhone: string;
    salerBankAndNumber: string;
    detailList?: IInvoiceDetail[];
    machineCode?: string;
    note?: string;
    [key: string]: any;
}
export interface IAliyunApiResponse {
    code: string;
    msg: string;
    data: IInvoiceRawData;
}
export interface IInvoiceVerifyResult {
    success: boolean;
    requestId: string;
    responseCode: string;
    responseMessage: string;
    responseDescription: string;
    charged: boolean;
    invoice: {
        invoiceType: string;
        invoiceCode: string;
        invoiceNumber: string;
        invoiceDate: string;
        checkCode: string;
        verificationResult: string;
        inspectionAmount: string;
        invalidMark: string;
        invalidMarkDescription: string;
        invoiceMoney: string;
        allTax: string;
        allValoremTax: string;
        purchaser: IPurchaserInfo;
        saler: ISalerInfo;
        details?: IInvoiceDetail[];
        machineCode?: string;
        note?: string;
    };
}
export interface IAliyunCredentials {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint?: string;
}
//# sourceMappingURL=invoice.types.d.ts.map
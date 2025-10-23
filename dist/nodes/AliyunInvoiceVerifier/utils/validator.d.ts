import { IInvoiceVerifyRequest } from '../types/invoice.types';
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function validateInvoiceNo(invoiceNo: string): void;
export declare function validateInvoiceDate(invoiceDate: string): void;
export declare function validateInvoiceCode(invoiceCode: string): void;
export declare function validateInvoiceSum(invoiceSum: string): void;
export declare function validateVerifyCode(verifyCode: string): void;
export declare function validateInvoiceKind(invoiceKind: number): void;
export declare function validateInvoiceParams(params: IInvoiceVerifyRequest): void;
//# sourceMappingURL=validator.d.ts.map
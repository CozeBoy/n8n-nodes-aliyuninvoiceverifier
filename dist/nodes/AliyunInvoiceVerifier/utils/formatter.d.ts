import { IAliyunApiResponse, IInvoiceVerifyResult } from '../types/invoice.types';
export declare function getInvalidMarkDescription(invalidMark: string): string;
export declare function getInvoiceTypeDescription(invoiceType: string): string;
export declare function getResponseCodeDescription(code: string): string;
export declare function isSuccessCode(code: string): boolean;
export declare function isChargedCode(code: string): boolean;
export declare function formatInvoiceVerifyResult(requestId: string, apiResponse: IAliyunApiResponse): IInvoiceVerifyResult;
export declare function formatErrorResult(error: any, requestId?: string): any;
//# sourceMappingURL=formatter.d.ts.map
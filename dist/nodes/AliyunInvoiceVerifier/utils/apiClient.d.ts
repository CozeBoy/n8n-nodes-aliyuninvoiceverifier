import ocr_api20210707 from '@alicloud/ocr-api20210707';
import { IAliyunCredentials, IInvoiceVerifyRequest, IAliyunApiResponse } from '../types/invoice.types';
export declare class ApiError extends Error {
    code?: string;
    requestId?: string;
    constructor(message: string, code?: string, requestId?: string);
}
export declare function createOcrClient(credentials: IAliyunCredentials): ocr_api20210707;
export declare function verifyInvoice(credentials: IAliyunCredentials, params: IInvoiceVerifyRequest): Promise<{
    requestId: string;
    data: IAliyunApiResponse;
}>;
//# sourceMappingURL=apiClient.d.ts.map
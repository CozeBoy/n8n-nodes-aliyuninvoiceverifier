/**
 * 阿里云 API 客户端封装
 */

import Credential from '@alicloud/credentials';
import ocr_api20210707, * as $ocr_api20210707 from '@alicloud/ocr-api20210707';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

import {
	IAliyunCredentials,
	IInvoiceVerifyRequest,
	IAliyunApiResponse,
} from '../types/invoice.types';

/**
 * API 调用错误类
 */
export class ApiError extends Error {
	code?: string;
	requestId?: string;

	constructor(message: string, code?: string, requestId?: string) {
		super(message);
		this.name = 'ApiError';
		this.code = code;
		this.requestId = requestId;
	}
}

/**
 * 阿里云错误码映射表
 */
const ERROR_CODE_MAP: { [key: string]: string } = {
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

/**
 * 创建阿里云 OCR API 客户端
 * @param credentials 阿里云凭证
 * @returns OCR API 客户端实例
 */
export function createOcrClient(credentials: IAliyunCredentials): ocr_api20210707 {
	try {
		// 创建凭证（使用环境变量方式）
		// 需要先设置环境变量
		process.env.ALIBABA_CLOUD_ACCESS_KEY_ID = credentials.accessKeyId;
		process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET = credentials.accessKeySecret;

		const credential = new Credential();

		// 创建 API 配置
		const config = new $OpenApi.Config({
			credential: credential,
		});
		config.endpoint = credentials.endpoint || 'ocr-api.cn-hangzhou.aliyuncs.com';

		// 创建 OCR 客户端
		return new ocr_api20210707(config);
	} catch (error: any) {
		throw new ApiError(`创建阿里云 API 客户端失败: ${error.message}`);
	}
}

/**
 * 调用发票核验 API
 * @param credentials 阿里云凭证
 * @param params 发票核验请求参数
 * @returns API 响应结果
 * @throws {ApiError} API 调用失败时抛出异常
 */
export async function verifyInvoice(
	credentials: IAliyunCredentials,
	params: IInvoiceVerifyRequest,
): Promise<{ requestId: string; data: IAliyunApiResponse }> {
	try {
		// 创建 OCR 客户端
		const client = createOcrClient(credentials);

		// 构建请求参数
		const request = new $ocr_api20210707.VerifyVATInvoiceRequest({
			invoiceCode: params.invoiceCode,
			invoiceNo: params.invoiceNo,
			invoiceDate: params.invoiceDate,
			invoiceSum: params.invoiceSum,
			verifyCode: params.verifyCode,
			invoiceKind: params.invoiceKind?.toString(),
		});

		// 设置运行时选项
		const runtime = new $Util.RuntimeOptions({});

		// 调用 API
		const response = await client.verifyVATInvoiceWithOptions(request, runtime);

		// 检查响应
		if (!response || !response.body) {
			throw new ApiError('API 返回数据为空');
		}

		const requestId = response.body.requestId || '';
		const dataString = response.body.data || '{}';

		// 解析返回数据
		let responseData: IAliyunApiResponse;
		try {
			responseData = JSON.parse(dataString);
		} catch (parseError: any) {
			throw new ApiError(`解析 API 响应数据失败: ${parseError.message}`, undefined, requestId);
		}

		// 不检查业务响应码，所有业务结果都返回给调用方处理
		// code 说明：
		// - 001: 核验成功
		// - 002: 发票不存在
		// - 003: 发票信息不一致
		// - 004: 其他业务错误
		// 这些都是正常的业务响应，不应作为异常抛出

		return {
			requestId,
			data: responseData,
		};
	} catch (error: any) {
		// 处理阿里云 SDK 错误
		if (error.name === 'ApiError') {
			throw error;
		}

		// 解析阿里云错误码
		const errorCode = error.code || error.name;
		const friendlyMessage = ERROR_CODE_MAP[errorCode] || error.message;

		// 获取 RequestId（用于问题排查）
		const requestId = error.data?.RequestId || error.requestId;

		// 网络错误
		if (error.name === 'NetworkError' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
			throw new ApiError('网络连接失败，请检查网络设置', 'NetworkError', requestId);
		}

		// 其他错误
		throw new ApiError(
			`阿里云 API 调用失败: ${friendlyMessage}`,
			errorCode,
			requestId,
		);
	}
}


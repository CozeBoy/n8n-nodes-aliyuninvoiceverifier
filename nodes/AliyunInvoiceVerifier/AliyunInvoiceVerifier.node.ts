import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	IAliyunCredentials,
	IInvoiceVerifyRequest,
	InvoiceKind,
} from './types/invoice.types';

import { validateInvoiceParams, ValidationError } from './utils/validator';
import { verifyInvoice, ApiError } from './utils/apiClient';
import { formatInvoiceVerifyResult, formatErrorResult } from './utils/formatter';

export class AliyunInvoiceVerifier implements INodeType {
	description: INodeTypeDescription = {
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
						value: InvoiceKind.Normal,
						description: '增值税专用发票、普通发票、数电发票等',
					},
					{
						name: '区块链发票',
						value: InvoiceKind.Blockchain,
						description: '区块链发票（所有参数均为必填）',
					},
				],
				default: InvoiceKind.Normal,
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		// 获取凭证
		let credentials: IAliyunCredentials;
		try {
			credentials = await this.getCredentials('aliyunInvoiceVerifierApi') as IAliyunCredentials;
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				'无法获取阿里云凭证配置，请检查凭证是否正确设置',
			);
		}

		// 遍历所有输入项
		for (let i = 0; i < length; i++) {
			try {
				// 获取节点参数
				const invoiceCode = this.getNodeParameter('invoiceCode', i, '') as string;
				const invoiceNo = this.getNodeParameter('invoiceNo', i) as string;
				const invoiceDate = this.getNodeParameter('invoiceDate', i) as string;
				const invoiceSum = this.getNodeParameter('invoiceSum', i, '') as string;
				const verifyCode = this.getNodeParameter('verifyCode', i, '') as string;
				const invoiceKind = this.getNodeParameter('invoiceKind', i, InvoiceKind.Normal) as InvoiceKind;

				// 构建请求参数
				const params: IInvoiceVerifyRequest = {
					invoiceCode: invoiceCode || undefined,
					invoiceNo,
					invoiceDate,
					invoiceSum: invoiceSum || undefined,
					verifyCode: verifyCode || undefined,
					invoiceKind,
				};

				// 验证参数
				try {
					validateInvoiceParams(params);
				} catch (validationError) {
					if (validationError instanceof ValidationError) {
						throw new NodeOperationError(
							this.getNode(),
							`参数验证失败: ${validationError.message}`,
							{ itemIndex: i },
						);
					}
					throw validationError;
				}

				// 调用 API
				let apiResponse;
				try {
					apiResponse = await verifyInvoice(credentials, params);
				} catch (apiError) {
					if (apiError instanceof ApiError) {
						const errorMessage = apiError.requestId
							? `${apiError.message} (RequestId: ${apiError.requestId})`
							: apiError.message;

						throw new NodeOperationError(
							this.getNode(),
							errorMessage,
							{ itemIndex: i },
						);
					}
					throw apiError;
				}

				// 格式化输出结果
				const result = formatInvoiceVerifyResult(apiResponse.requestId, apiResponse.data);

				// 添加到返回数据
				returnData.push({
					json: result as any,
					pairedItem: { item: i },
				});

			} catch (error) {
				// 错误处理
				if (this.continueOnFail()) {
					// 如果设置了"失败时继续"，将错误信息添加到输出
					returnData.push({
						json: formatErrorResult(error),
						pairedItem: { item: i },
					});
					continue;
				}

				// 否则抛出错误
				if (error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeOperationError(
					this.getNode(),
					`发票核验失败: ${(error as Error).message}`,
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}


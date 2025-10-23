/**
 * 参数验证工具类
 */

import { IInvoiceVerifyRequest, InvoiceKind } from '../types/invoice.types';

/**
 * 验证错误类
 */
export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

/**
 * 验证发票号码格式
 * @param invoiceNo 发票号码
 * @throws {ValidationError} 格式错误时抛出异常
 */
export function validateInvoiceNo(invoiceNo: string): void {
	if (!invoiceNo) {
		throw new ValidationError('发票号码不能为空');
	}

	// 发票号码应为 8-20 位数字
	if (!/^\d{8,20}$/.test(invoiceNo)) {
		throw new ValidationError('发票号码格式错误，应为 8-20 位数字');
	}
}

/**
 * 验证开票日期格式
 * @param invoiceDate 开票日期（YYYYMMDD）
 * @throws {ValidationError} 格式错误时抛出异常
 */
export function validateInvoiceDate(invoiceDate: string): void {
	if (!invoiceDate) {
		throw new ValidationError('开票日期不能为空');
	}

	// 检查格式
	if (!/^\d{8}$/.test(invoiceDate)) {
		throw new ValidationError('开票日期格式错误，应为 YYYYMMDD 格式（如：20231015）');
	}

	// 验证日期有效性
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

	// 检查日期是否真实存在
	const date = new Date(year, month - 1, day);
	if (
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day
	) {
		throw new ValidationError('开票日期无效，请检查日期是否正确');
	}
}

/**
 * 验证发票代码格式
 * @param invoiceCode 发票代码
 * @throws {ValidationError} 格式错误时抛出异常
 */
export function validateInvoiceCode(invoiceCode: string): void {
	if (!invoiceCode) {
		return; // 发票代码可能为空（数电发票）
	}

	// 发票代码通常为 10-12 位数字
	if (!/^\d{10,12}$/.test(invoiceCode)) {
		throw new ValidationError('发票代码格式错误，应为 10-12 位数字');
	}
}

/**
 * 验证发票金额格式
 * @param invoiceSum 发票金额
 * @throws {ValidationError} 格式错误时抛出异常
 */
export function validateInvoiceSum(invoiceSum: string): void {
	if (!invoiceSum) {
		return; // 发票金额在某些情况下可为空
	}

	// 金额格式：数字，最多两位小数
	if (!/^\d+(\.\d{1,2})?$/.test(invoiceSum)) {
		throw new ValidationError('发票金额格式错误，应为数字且最多两位小数（如：322.33）');
	}

	// 金额应大于0
	const amount = parseFloat(invoiceSum);
	if (amount <= 0) {
		throw new ValidationError('发票金额必须大于 0');
	}
}

/**
 * 验证校验码格式
 * @param verifyCode 校验码
 * @throws {ValidationError} 格式错误时抛出异常
 */
export function validateVerifyCode(verifyCode: string): void {
	if (!verifyCode) {
		return; // 校验码在某些情况下可为空
	}

	// 校验码应为 6 位数字或字符
	if (verifyCode.length !== 6) {
		throw new ValidationError('校验码应为 6 位（取发票校验码后 6 位）');
	}

	// 校验码通常为数字和字母
	if (!/^[0-9a-zA-Z]{6}$/.test(verifyCode)) {
		throw new ValidationError('校验码格式错误，应为 6 位数字或字母');
	}
}

/**
 * 验证发票类型
 * @param invoiceKind 发票类型
 * @throws {ValidationError} 格式错误时抛出异常
 */
export function validateInvoiceKind(invoiceKind: number): void {
	if (invoiceKind !== InvoiceKind.Normal && invoiceKind !== InvoiceKind.Blockchain) {
		throw new ValidationError('发票类型只能是 0（普通发票）或 1（区块链发票）');
	}
}

/**
 * 验证所有发票核验请求参数
 * @param params 发票核验请求参数
 * @throws {ValidationError} 参数验证失败时抛出异常
 */
export function validateInvoiceParams(params: IInvoiceVerifyRequest): void {
	// 基础必填项验证
	validateInvoiceNo(params.invoiceNo);
	validateInvoiceDate(params.invoiceDate);

	// 可选项验证
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

	// 区块链发票特殊验证
	if (params.invoiceKind === InvoiceKind.Blockchain) {
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


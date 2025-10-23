/**
 * 参数验证工具测试
 */

import {
	validateInvoiceNo,
	validateInvoiceDate,
	validateInvoiceCode,
	validateInvoiceSum,
	validateVerifyCode,
	validateInvoiceParams,
	ValidationError,
} from '../nodes/AliyunInvoiceVerifier/utils/validator';
import { InvoiceKind } from '../nodes/AliyunInvoiceVerifier/types/invoice.types';

describe('Validator Tests', () => {
	describe('validateInvoiceNo', () => {
		it('应该接受有效的8位发票号码', () => {
			expect(() => validateInvoiceNo('12345678')).not.toThrow();
		});

		it('应该接受有效的20位发票号码', () => {
			expect(() => validateInvoiceNo('12345678901234567890')).not.toThrow();
		});

		it('应该拒绝空发票号码', () => {
			expect(() => validateInvoiceNo('')).toThrow(ValidationError);
		});

		it('应该拒绝少于8位的发票号码', () => {
			expect(() => validateInvoiceNo('1234567')).toThrow(ValidationError);
		});

		it('应该拒绝多于20位的发票号码', () => {
			expect(() => validateInvoiceNo('123456789012345678901')).toThrow(ValidationError);
		});

		it('应该拒绝包含非数字的发票号码', () => {
			expect(() => validateInvoiceNo('1234567A')).toThrow(ValidationError);
		});
	});

	describe('validateInvoiceDate', () => {
		it('应该接受有效的日期', () => {
			expect(() => validateInvoiceDate('20231015')).not.toThrow();
		});

		it('应该拒绝空日期', () => {
			expect(() => validateInvoiceDate('')).toThrow(ValidationError);
		});

		it('应该拒绝格式错误的日期', () => {
			expect(() => validateInvoiceDate('2023-10-15')).toThrow(ValidationError);
		});

		it('应该拒绝无效的年份', () => {
			expect(() => validateInvoiceDate('19991015')).toThrow(ValidationError);
			expect(() => validateInvoiceDate('21001015')).toThrow(ValidationError);
		});

		it('应该拒绝无效的月份', () => {
			expect(() => validateInvoiceDate('20231315')).toThrow(ValidationError);
		});

		it('应该拒绝无效的日期', () => {
			expect(() => validateInvoiceDate('20231032')).toThrow(ValidationError);
		});

		it('应该拒绝不存在的日期', () => {
			expect(() => validateInvoiceDate('20230230')).toThrow(ValidationError);
		});
	});

	describe('validateInvoiceCode', () => {
		it('应该接受有效的发票代码', () => {
			expect(() => validateInvoiceCode('0110018012')).not.toThrow();
			expect(() => validateInvoiceCode('011001801234')).not.toThrow();
		});

		it('应该接受空发票代码', () => {
			expect(() => validateInvoiceCode('')).not.toThrow();
		});

		it('应该拒绝格式错误的发票代码', () => {
			expect(() => validateInvoiceCode('123')).toThrow(ValidationError);
			expect(() => validateInvoiceCode('12345678901234')).toThrow(ValidationError);
		});
	});

	describe('validateInvoiceSum', () => {
		it('应该接受有效的金额', () => {
			expect(() => validateInvoiceSum('100')).not.toThrow();
			expect(() => validateInvoiceSum('100.5')).not.toThrow();
			expect(() => validateInvoiceSum('100.50')).not.toThrow();
		});

		it('应该接受空金额', () => {
			expect(() => validateInvoiceSum('')).not.toThrow();
		});

		it('应该拒绝格式错误的金额', () => {
			expect(() => validateInvoiceSum('100.555')).toThrow(ValidationError);
			expect(() => validateInvoiceSum('abc')).toThrow(ValidationError);
		});

		it('应该拒绝负数金额', () => {
			expect(() => validateInvoiceSum('-100')).toThrow(ValidationError);
		});

		it('应该拒绝零金额', () => {
			expect(() => validateInvoiceSum('0')).toThrow(ValidationError);
		});
	});

	describe('validateVerifyCode', () => {
		it('应该接受有效的校验码', () => {
			expect(() => validateVerifyCode('123456')).not.toThrow();
			expect(() => validateVerifyCode('abc123')).not.toThrow();
		});

		it('应该接受空校验码', () => {
			expect(() => validateVerifyCode('')).not.toThrow();
		});

		it('应该拒绝长度错误的校验码', () => {
			expect(() => validateVerifyCode('12345')).toThrow(ValidationError);
			expect(() => validateVerifyCode('1234567')).toThrow(ValidationError);
		});

		it('应该拒绝包含特殊字符的校验码', () => {
			expect(() => validateVerifyCode('12345@')).toThrow(ValidationError);
		});
	});

	describe('validateInvoiceParams', () => {
		it('应该接受有效的普通发票参数', () => {
			const params = {
				invoiceNo: '12345678',
				invoiceDate: '20231015',
			};
			expect(() => validateInvoiceParams(params)).not.toThrow();
		});

		it('应该接受有效的区块链发票参数', () => {
			const params = {
				invoiceCode: '0110018012',
				invoiceNo: '12345678',
				invoiceDate: '20231015',
				invoiceSum: '100.50',
				verifyCode: '123456',
				invoiceKind: InvoiceKind.Blockchain,
			};
			expect(() => validateInvoiceParams(params)).not.toThrow();
		});

		it('区块链发票缺少必填参数时应该抛出错误', () => {
			const params = {
				invoiceNo: '12345678',
				invoiceDate: '20231015',
				invoiceKind: InvoiceKind.Blockchain,
			};
			expect(() => validateInvoiceParams(params)).toThrow(ValidationError);
		});
	});
});


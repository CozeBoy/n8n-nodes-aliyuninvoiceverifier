/**
 * 数据格式化工具测试
 */

import {
	formatInvoiceVerifyResult,
	getInvalidMarkDescription,
	getInvoiceTypeDescription,
} from '../nodes/AliyunInvoiceVerifier/utils/formatter';

describe('Formatter Tests', () => {
	describe('getInvalidMarkDescription', () => {
		it('应该返回正确的作废标志说明', () => {
			expect(getInvalidMarkDescription('N')).toBe('未作废（正常）');
			expect(getInvalidMarkDescription('Y')).toBe('已作废');
			expect(getInvalidMarkDescription('H')).toBe('冲红');
			expect(getInvalidMarkDescription('7')).toBe('部分冲红');
			expect(getInvalidMarkDescription('8')).toBe('全额冲红');
		});

		it('未知标志应该返回原值', () => {
			expect(getInvalidMarkDescription('X')).toBe('X');
		});
	});

	describe('getInvoiceTypeDescription', () => {
		it('应该返回正确的发票类型说明', () => {
			expect(getInvoiceTypeDescription('01')).toBe('增值税专用发票');
			expect(getInvoiceTypeDescription('10')).toBe('增值税电子普通发票');
			expect(getInvoiceTypeDescription('31')).toBe('数电发票（专用发票）');
		});

		it('未知类型应该返回带代码的说明', () => {
			expect(getInvoiceTypeDescription('99')).toBe('发票类型代码: 99');
		});
	});

	describe('formatInvoiceVerifyResult', () => {
		it('应该正确格式化发票核验结果', () => {
			const apiResponse = {
				code: '001',
				msg: '成功',
				data: {
					invoiceType: '10',
					invoiceCode: '011001801234',
					invoiceNumber: '12345678',
					invoiceDate: '20231015',
					checkCode: '123456',
					cyjgxx: '查验成功发票一致',
					inspectionAmount: '1',
					invalidMark: 'N',
					invoiceMoney: '100.00',
					allTax: '3.00',
					allValoremTax: '103.00',
					purchaserName: '测试公司',
					purchaserTaxpayerNumber: '1234567890',
					purchaserAddressOrPhone: '测试地址',
					purchaserBankAndNumber: '测试银行',
					salerName: '销售公司',
					salerTaxpayerNumber: '0987654321',
					salerAddressOrPhone: '销售地址',
					salerBankAndNumber: '销售银行',
					detailList: [],
				},
			};

			const result = formatInvoiceVerifyResult('test-request-id', apiResponse);

			expect(result.success).toBe(true);
			expect(result.requestId).toBe('test-request-id');
			expect(result.invoice.invoiceType).toBe('10');
			expect(result.invoice.invoiceNumber).toBe('12345678');
			expect(result.invoice.purchaser.name).toBe('测试公司');
			expect(result.invoice.saler.name).toBe('销售公司');
		});
	});
});


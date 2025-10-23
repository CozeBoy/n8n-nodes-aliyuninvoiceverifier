/**
 * 发票核验相关的 TypeScript 类型定义
 */

/**
 * 发票类型枚举
 */
export enum InvoiceKind {
	/** 普通发票 */
	Normal = 0,
	/** 区块链发票 */
	Blockchain = 1,
}

/**
 * 作废标志枚举
 */
export enum InvalidMark {
	/** 未作废（正常） */
	Normal = 'N',
	/** 已作废 */
	Invalid = 'Y',
	/** 冲红 */
	RedFlushed = 'H',
	/** 部分冲红 */
	PartialRedFlushed = '7',
	/** 全额冲红 */
	FullRedFlushed = '8',
}

/**
 * 发票核验请求参数
 */
export interface IInvoiceVerifyRequest {
	/** 发票代码 */
	invoiceCode?: string;
	/** 发票号码 */
	invoiceNo: string;
	/** 开票日期（YYYYMMDD） */
	invoiceDate: string;
	/** 发票金额 */
	invoiceSum?: string;
	/** 校验码（后6位） */
	verifyCode?: string;
	/** 发票类型（0=普通，1=区块链） */
	invoiceKind?: InvoiceKind;
}

/**
 * 发票明细
 */
export interface IInvoiceDetail {
	/** 行号 */
	rowNo: string;
	/** 明细序号 */
	detailNo: string;
	/** 货物或应税劳务名称 */
	goodsName: string;
	/** 规格型号 */
	standard: string;
	/** 单位 */
	unit: string;
	/** 数量 */
	num: string;
	/** 单价 */
	netValue: string;
	/** 金额 */
	detailAmount: string;
	/** 税率 */
	taxRate: string;
	/** 税额 */
	allTax: string;
	/** 税分类编码 */
	taxClassifyCode: string;
	/** 费用项目 */
	expenseItem: string;
	/** 车牌号 */
	plate_no: string;
	/** 通行日期起 */
	trafficDateStart: string;
	/** 通行日期止 */
	trafficDateEnd: string;
	/** 类型 */
	type: string;
	/** 含税单价 */
	taxUnitPrice: string;
	/** 含税金额 */
	taxDetailAmount: string;
}

/**
 * 购方信息
 */
export interface IPurchaserInfo {
	/** 购方名称 */
	name: string;
	/** 购方税号 */
	taxNumber: string;
	/** 购方地址、电话 */
	addressOrPhone: string;
	/** 购方开户行及账号 */
	bankAndNumber: string;
}

/**
 * 销方信息
 */
export interface ISalerInfo {
	/** 销方名称 */
	name: string;
	/** 销方税号 */
	taxNumber: string;
	/** 销方地址、电话 */
	addressOrPhone: string;
	/** 销方开户行及账号 */
	bankAndNumber: string;
}

/**
 * 发票核验结果（原始API返回格式）
 */
export interface IInvoiceRawData {
	/** 发票种类代码 */
	invoiceType: string;
	/** 发票代码 */
	invoiceCode: string;
	/** 发票号码 */
	invoiceNumber: string;
	/** 开票日期 */
	invoiceDate: string;
	/** 校验码 */
	checkCode: string;
	/** 查验结果信息 */
	cyjgxx: string;
	/** 查验次数 */
	inspectionAmount: string;
	/** 作废标志 */
	invalidMark: string;
	/** 发票金额（不含税） */
	invoiceMoney: string;
	/** 税额 */
	allTax: string;
	/** 价税合计 */
	allValoremTax: string;
	/** 购方名称 */
	purchaserName: string;
	/** 购方税号 */
	purchaserTaxpayerNumber: string;
	/** 购方地址、电话 */
	purchaserAddressOrPhone: string;
	/** 购方开户行及账号 */
	purchaserBankAndNumber: string;
	/** 销方名称 */
	salerName: string;
	/** 销方税号 */
	salerTaxpayerNumber: string;
	/** 销方地址、电话 */
	salerAddressOrPhone: string;
	/** 销方开户行及账号 */
	salerBankAndNumber: string;
	/** 发票明细列表 */
	detailList?: IInvoiceDetail[];
	/** 机器编号 */
	machineCode?: string;
	/** 备注 */
	note?: string;
	/** 其他可选字段 */
	[key: string]: any;
}

/**
 * 阿里云API原始响应
 */
export interface IAliyunApiResponse {
	/** 响应码 */
	code: string;
	/** 响应消息 */
	msg: string;
	/** 发票数据 */
	data: IInvoiceRawData;
}

/**
 * 格式化后的发票核验结果
 */
export interface IInvoiceVerifyResult {
	/** 是否成功（code === '001' 或 '000000' 时为 true） */
	success: boolean;
	/** 请求ID */
	requestId: string;
	/** 业务响应码 */
	responseCode: string;
	/** 业务响应消息 */
	responseMessage: string;
	/** 响应码描述（中文说明） */
	responseDescription: string;
	/** 是否计费（重要：006、009、1005 等虽然查验失败但仍会计费） */
	charged: boolean;
	/** 发票信息 */
	invoice: {
		/** 发票种类代码 */
		invoiceType: string;
		/** 发票代码 */
		invoiceCode: string;
		/** 发票号码 */
		invoiceNumber: string;
		/** 开票日期 */
		invoiceDate: string;
		/** 校验码 */
		checkCode: string;
		/** 查验结果 */
		verificationResult: string;
		/** 查验次数 */
		inspectionAmount: string;
		/** 作废标志（N/Y/H/7/8） */
		invalidMark: string;
		/** 作废标志说明（中文） */
		invalidMarkDescription: string;
		/** 发票金额（不含税） */
		invoiceMoney: string;
		/** 税额 */
		allTax: string;
		/** 价税合计 */
		allValoremTax: string;
		/** 购方信息 */
		purchaser: IPurchaserInfo;
		/** 销方信息 */
		saler: ISalerInfo;
		/** 发票明细列表 */
		details?: IInvoiceDetail[];
		/** 机器编号 */
		machineCode?: string;
		/** 备注 */
		note?: string;
	};
}

/**
 * 阿里云凭证配置
 */
export interface IAliyunCredentials {
	/** AccessKey ID */
	accessKeyId: string;
	/** AccessKey Secret */
	accessKeySecret: string;
	/** API端点 */
	endpoint?: string;
}


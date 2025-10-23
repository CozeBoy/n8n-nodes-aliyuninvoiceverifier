# n8n-nodes-aliyuninvoiceverifier

[English](README.md) | 简体中文

> 🧾 阿里云增值税发票核验 n8n 社区节点

这是一个用于 [n8n](https://n8n.io/) 工作流自动化工具的社区节点，通过阿里云 OCR API 实现增值税发票真伪核验功能。

## ✨ 功能特性

- ✅ **完整的发票核验支持**：支持增值税专用发票、普通发票、电子发票、数电发票等多种发票类型
- 🔐 **安全的凭证管理**：通过 n8n 凭证系统安全存储阿里云 AccessKey
- 📊 **丰富的返回数据**：返回发票详细信息，包括购销方信息、金额、税额、明细等
- 🎯 **智能状态码处理**：支持 40+ 种业务状态码，自动识别成功/失败/计费状态
- 💰 **计费状态标识**：明确标识哪些调用会产生费用，帮助控制成本
- 🌐 **国际化支持**：提供中文和英文界面
- 🔄 **批量处理能力**：支持在 n8n 工作流中批量核验发票
- ⚡ **错误处理优化**：业务错误不会中断工作流，便于后续处理

## 📦 安装

### 在 n8n 中安装

#### 方法 1：通过社区节点安装（推荐）

1. 打开 n8n 界面
2. 进入 **设置（Settings）** → **社区节点（Community Nodes）**
3. 点击 **安装（Install）**
4. 输入包名：`n8n-nodes-aliyuninvoiceverifier`
5. 点击 **安装（Install）**

#### 方法 2：通过 npm 全局安装

```bash
npm install -g n8n-nodes-aliyuninvoiceverifier
```

#### 方法 3：作为 n8n 项目依赖安装

```bash
cd ~/.n8n
npm install n8n-nodes-aliyuninvoiceverifier
```

## 🚀 快速开始

### 1. 开通阿里云发票核验服务

在使用本节点前，需要先在阿里云开通发票核验服务：

#### 步骤 1：开通票证核验服务

1. 访问 [票证核验服务开通页面](https://common-buy.aliyun.com/?commodityCode=ocr_cardverification_public_cn)
2. 点击"立即开通"
3. 开通后您可享受 **50 次免费额度** ✨

#### 步骤 2：购买资源包（可选）

您可以选择以下两种计费方式：

**方式 A：购买资源包**（推荐，更优惠）
- 访问 [发票核验资源包购买页面](https://common-buy.aliyun.com/?commodityCode=ocr_cardverification_dp_cn)
- 选择合适的资源包规格（1000 次起）
- 资源包有效期通常为 1 年

**方式 B：按量付费**
- 无需购买资源包
- 系统根据实际调用量自动扣款
- 计费详情参见 [按量付费说明](https://help.aliyun.com/zh/ocr/product-overview/pay-as-you-go)

💡 **提示**：
- 资源包价格更优惠，适合有稳定调用量的场景
- 按量付费灵活方便，适合初期测试或调用量不确定的场景
- 资源包用完后会自动切换为按量付费

#### 步骤 3：配置 RAM 权限（使用子账号时）

如果使用 **RAM 子账号**（推荐用于生产环境），需要主账号授予相应权限：

1. **创建 RAM 用户**
   - 登录 [RAM 控制台](https://ram.console.aliyun.com/users)
   - 创建 RAM 用户并生成 AccessKey
   - 详细步骤参见：[创建 RAM 用户](https://help.aliyun.com/zh/ram/user-guide/create-a-ram-user)

2. **授予 OCR 权限**
   - 为 RAM 用户添加权限策略：**AliyunOCRFullAccess**
   - 详细步骤参见：[为 RAM 用户授权](https://help.aliyun.com/zh/ram/user-guide/grant-permissions-to-the-ram-user)

3. **最小权限原则**（可选）
   ```json
   {
     "Version": "1",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ocr:VerifyVATInvoice"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

#### 步骤 4：获取 AccessKey

1. 登录 [阿里云控制台](https://usercenter.console.aliyun.com/#/manage/ak)
2. 创建或查看 AccessKey ID 和 AccessKey Secret
3. ⚠️ **安全提示**：请妥善保管 AccessKey Secret，不要泄露或提交到代码仓库

### 2. 配置 n8n 凭证

在 n8n 中添加阿里云凭证：

1. 打开 n8n 界面
2. 进入 **设置** → **凭证**
3. 点击 **新建凭证**
4. 搜索并选择 **阿里云发票核验 API**
5. 填写以下信息：

**凭证配置项**：
- **AccessKey ID**：阿里云 AccessKey ID（必填）
- **AccessKey Secret**：阿里云 AccessKey Secret（必填）
- **API 端点**：默认为 `ocr-api.cn-hangzhou.aliyuncs.com`（选填）

⚠️ **重要提示**：
- 建议使用 RAM 子账号的 AccessKey，不要使用主账号
- 遵循最小权限原则，只授予必要的 OCR 权限
- 定期轮换 AccessKey，提高安全性

### 3. 添加节点到工作流

1. 在 n8n 工作流编辑器中点击 **+** 添加节点
2. 搜索 "**阿里云发票核验**" 或 "**Aliyun Invoice**"
3. 选择节点并配置参数

### 4. 配置节点参数

**必填参数**：
- **发票号码（Invoice Number）**：8-20 位数字
- **开票日期（Invoice Date）**：格式 YYYYMMDD（如：20231015）

**选填参数**：
- **发票代码（Invoice Code）**：10-12 位数字（数电发票可为空）
- **发票金额（Invoice Amount）**：根据发票类型填写相应金额
- **校验码（Verify Code）**：校验码后 6 位（部分发票类型必填）
- **发票类型（Invoice Kind）**：普通发票（0）或区块链发票（1）

## 📋 发票类型说明

不同类型发票的参数要求：

| 发票类型代码 | 发票名称 | 发票代码 | 发票金额 | 校验码 |
|------------|---------|---------|---------|--------|
| 01 | 增值税专用发票 | 必填 | 不含税金额 | 选填 |
| 03 | 机动车销售统一发票（专用） | 必填 | 不含税金额 | 选填 |
| 04 | 增值税普通发票（卷票） | 必填 | 不含税金额 | **必填** |
| 10 | 增值税电子普通发票 | 必填 | 不含税金额 | **必填** |
| 11 | 增值税普通发票 | 必填 | 不含税金额 | **必填** |
| 14 | 通行费增值税电子普通发票 | 必填 | 不含税金额 | **必填** |
| 15 | 二手车销售统一发票 | 必填 | 车价合计 | 选填 |
| 20 | 机动车销售统一发票 | 必填 | 不含税金额 | 选填 |
| 31 | 数电发票（专用发票） | 可为空 | 含税金额 | 选填 |
| 32 | 数电发票（普通发票） | 可为空 | 含税金额 | 选填 |
| 区块链发票 | 区块链发票 | 必填 | 不含税金额 | **必填** |

## 📤 返回数据结构

节点返回一个包含完整发票信息的 JSON 对象：

```json
{
  "success": true,
  "requestId": "55B2BB6D-EA14-5828-AB61-3CE168377D64",
  "responseCode": "001",
  "responseMessage": "成功",
  "responseDescription": "成功",
  "charged": true,
  "invoice": {
    "invoiceType": "01",
    "invoiceCode": "011001801234",
    "invoiceNumber": "35314567",
    "invoiceDate": "20231015",
    "checkCode": "123456",
    "verificationResult": "相符",
    "inspectionAmount": "1",
    "invalidMark": "N",
    "invoiceMoney": "322.33",
    "allTax": "20.95",
    "allValoremTax": "343.28",
    "purchaser": {
      "name": "购方公司名称",
      "taxNumber": "91330100MA27XYZ123",
      "addressOrPhone": "杭州市西湖区某某路123号 0571-12345678",
      "bankAndNumber": "中国银行杭州分行 1234567890"
    },
    "saler": {
      "name": "销方公司名称",
      "taxNumber": "91330106MA27ABC456",
      "addressOrPhone": "杭州市余杭区某某街456号 0571-87654321",
      "bankAndNumber": "工商银行杭州分行 0987654321"
    },
    "details": [
      {
        "goodsName": "办公用品",
        "detailAmount": "100.00",
        "taxRate": "0.13",
        "allTax": "13.00"
      }
    ],
    "machineCode": "499098765432",
    "note": "备注信息"
  }
}
```

### 关键字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 核验是否成功（`true` 表示成功） |
| `responseCode` | string | 业务响应码（见下方状态码说明） |
| `responseMessage` | string | 响应消息 |
| `responseDescription` | string | 响应码的中文描述 |
| `charged` | boolean | **是否计费**（`true` 表示本次调用会产生费用） |
| `invoice` | object | 发票详细信息 |

## 🔢 状态码说明

### ✅ 成功状态（计费）

| 状态码 | 说明 | 是否计费 |
|--------|------|---------|
| 001 | 成功 | ✅ 是 |
| 000000 | 成功 | ✅ 是 |

### ⚠️ 发票状态相关（部分计费）

| 状态码 | 说明 | 是否计费 |
|--------|------|---------|
| 006 | 发票信息不一致 | ⚠️ **是** |
| 009 | 所查发票不存在 | ⚠️ **是** |
| 1005 | 请核对四要素是否符合发票规范 | ⚠️ **是** |

> ⚠️ **重要提示**：即使核验失败，上述状态码仍会产生费用！

### 🚫 参数错误（不计费）

| 状态码 | 说明 |
|--------|------|
| 110-114 | 参数格式错误 |
| 111000-111001 | 参数验证错误 |

### ⏱️ 查验限制（不计费）

| 状态码 | 说明 |
|--------|------|
| 002 | 超过该张票当天查验次数 |
| 104 | 已超过最大查验量 |
| 10017 | 超过五年的不能查验 |

### 🔐 权限相关（不计费）

| 状态码 | 说明 |
|--------|------|
| 131002-131005 | 接口权限或限流错误 |
| 10020 | 没有查验权限 |

完整的状态码列表请参见 [状态码文档](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifyvatinvoice)。

## 💡 使用示例

### 示例 1：单张发票核验

```
手动触发 → 阿里云发票核验 → 判断 success → 处理结果
```

### 示例 2：批量发票核验

```
读取 Excel → 遍历行 → 阿里云发票核验 → 收集结果 → 导出报表
```

### 示例 3：发票核验并通知

```
Webhook 接收 → 阿里云发票核验 → IF 节点判断 → 成功：发送邮件 / 失败：记录日志
```

### 示例 4：基于计费状态的成本控制

```
阿里云发票核验 → Switch 节点（基于 charged 字段）
  → charged=true + success=true：正常处理
  → charged=true + success=false：记录为计费失败，发送警告
  → charged=false：参数错误，不重试
```

## ⚙️ 高级配置

### 环境变量

如需自定义 API 端点，可在凭证中配置或通过环境变量设置：

```bash
ALIYUN_OCR_ENDPOINT=ocr-api.cn-shanghai.aliyuncs.com
```

### 错误处理

节点支持 n8n 的"失败时继续"模式。启用后，即使核验失败，工作流也会继续执行，错误信息会包含在输出中。

## 💰 成本控制建议

1. **参数预验证**：在调用 API 前验证参数格式，避免不必要的计费
2. **结果缓存**：对已核验成功的发票进行缓存，避免重复查验
3. **去重处理**：批量处理时先去重，避免重复查验同一张发票
4. **监控计费**：使用 `charged` 字段统计实际产生的费用
5. **错误重试策略**：
   - 参数错误（110-114）→ 不重试
   - 系统异常（106, 121xxx）→ 可重试
   - 计费失败（006, 009, 1005）→ 不重试，通知用户

## 🔧 开发与调试

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/CozeBoy/n8n-nodes-aliyuninvoiceverifier.git
cd n8n-nodes-aliyuninvoiceverifier

# 安装依赖
npm install

# 构建
npm run build

# 链接到 n8n
npm link
cd ~/.n8n
npm link n8n-nodes-aliyuninvoiceverifier

# 重启 n8n
n8n start
```

## 📚 相关资源

- [n8n 官方文档](https://docs.n8n.io/)
- [n8n 社区节点开发指南](https://docs.n8n.io/integrations/creating-nodes/)
- [阿里云 OCR 文档](https://help.aliyun.com/zh/ocr/)
- [阿里云发票核验 API](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifyvatinvoice)

## ❓ 常见问题

### Q: 支持哪些发票类型？
A: 支持增值税专用发票、普通发票、电子发票、数电发票、机动车发票、二手车发票、区块链发票等。

### Q: 为什么查验失败还要计费？
A: 阿里云 API 对于发票存在但信息不一致（状态码 006、009、1005）的情况仍会计费，这是正常的业务行为。

### Q: 如何避免重复查验？
A: 建议在工作流中添加去重逻辑，或使用数据库记录已查验的发票。

### Q: 节点安装后找不到？
A: 请确认：1) n8n 已重启；2) 检查 n8n 日志是否有加载错误；3) 清除浏览器缓存。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE.md)

## 🙏 致谢

- 感谢 [n8n](https://n8n.io/) 提供优秀的工作流自动化平台
- 感谢 [阿里云](https://www.aliyun.com/) 提供发票核验 API 服务

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue：[GitHub Issues](https://github.com/CozeBoy/n8n-nodes-aliyuninvoiceverifier/issues)
- Email: your.email@example.com

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**


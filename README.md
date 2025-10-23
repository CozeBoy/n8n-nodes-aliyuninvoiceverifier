# n8n-nodes-aliyuninvoiceverifier

English | [简体中文](README.zh-CN.md)

> 🧾 Aliyun VAT Invoice Verification Node for n8n

A community node for [n8n](https://n8n.io/) workflow automation tool that enables VAT invoice verification through Aliyun OCR API.

## ✨ Features

- ✅ **Complete Invoice Verification Support**: Supports various invoice types including VAT special invoices, ordinary invoices, e-invoices, digital e-invoices, etc.
- 🔐 **Secure Credential Management**: Securely store Aliyun AccessKey through n8n's credential system
- 📊 **Rich Return Data**: Returns detailed invoice information including purchaser/seller info, amounts, taxes, details, etc.
- 🎯 **Smart Status Code Handling**: Supports 40+ business status codes with automatic success/failure/charging status recognition
- 💰 **Charging Status Indicator**: Clearly identifies which API calls will incur charges, helping control costs
- 🌐 **Internationalization**: Provides both Chinese and English interfaces
- 🔄 **Batch Processing**: Supports batch invoice verification in n8n workflows
- ⚡ **Optimized Error Handling**: Business errors won't interrupt workflow, facilitating subsequent processing

## 📦 Installation

### Install in n8n

#### Method 1: Install via Community Nodes (Recommended)

1. Open n8n interface
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter package name: `n8n-nodes-aliyuninvoiceverifier`
5. Click **Install**

#### Method 2: Install globally via npm

```bash
npm install -g n8n-nodes-aliyuninvoiceverifier
```

#### Method 3: Install as n8n project dependency

```bash
cd ~/.n8n
npm install n8n-nodes-aliyuninvoiceverifier
```

## 🚀 Quick Start

### 1. Activate Aliyun Invoice Verification Service

Before using this node, you need to activate the invoice verification service on Aliyun:

#### Step 1: Activate Certificate Verification Service

1. Visit [Certificate Verification Service Activation Page](https://common-buy.aliyun.com/?commodityCode=ocr_cardverification_public_cn)
2. Click "Activate Now"
3. After activation, you'll receive **50 free quota** ✨

#### Step 2: Purchase Resource Package (Optional)

You can choose between two billing methods:

**Option A: Purchase Resource Package** (Recommended, more cost-effective)
- Visit [Invoice Verification Resource Package Purchase Page](https://common-buy.aliyun.com/?commodityCode=ocr_cardverification_dp_cn)
- Select appropriate package size (starting from 1000 calls)
- Packages typically valid for 1 year

**Option B: Pay-as-you-go**
- No need to purchase resource package
- System automatically charges based on actual usage
- See [Pay-as-you-go Documentation](https://help.aliyun.com/zh/ocr/product-overview/pay-as-you-go) for pricing details

💡 **Tips**:
- Resource packages offer better pricing for stable usage scenarios
- Pay-as-you-go provides flexibility for testing or uncertain usage
- System automatically switches to pay-as-you-go when package is exhausted

#### Step 3: Configure RAM Permissions (When Using Sub-accounts)

If using **RAM sub-account** (recommended for production), main account needs to grant permissions:

1. **Create RAM User**
   - Log in to [RAM Console](https://ram.console.aliyun.com/users)
   - Create RAM user and generate AccessKey
   - See detailed steps: [Create RAM User](https://help.aliyun.com/zh/ram/user-guide/create-a-ram-user)

2. **Grant OCR Permissions**
   - Add permission policy to RAM user: **AliyunOCRFullAccess**
   - See detailed steps: [Grant Permissions to RAM User](https://help.aliyun.com/zh/ram/user-guide/grant-permissions-to-the-ram-user)

3. **Minimum Privilege Principle** (Optional)
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

#### Step 4: Obtain AccessKey

1. Log in to [Aliyun Console](https://usercenter.console.aliyun.com/#/manage/ak)
2. Create or view AccessKey ID and AccessKey Secret
3. ⚠️ **Security Note**: Keep AccessKey Secret safe, don't expose or commit to code repository

### 2. Configure n8n Credentials

Add Aliyun credentials in n8n:

1. Open n8n interface
2. Go to **Settings** → **Credentials**
3. Click **Create New Credential**
4. Search and select **Aliyun Invoice Verifier API**
5. Fill in the following information:

**Credential Configuration**:
- **AccessKey ID**: Aliyun AccessKey ID (Required)
- **AccessKey Secret**: Aliyun AccessKey Secret (Required)
- **API Endpoint**: Default `ocr-api.cn-hangzhou.aliyuncs.com` (Optional)

⚠️ **Important Notes**:
- Recommended to use RAM sub-account AccessKey instead of main account
- Follow minimum privilege principle, grant only necessary OCR permissions
- Rotate AccessKey regularly to improve security

### 3. Add Node to Workflow

1. Click **+** in n8n workflow editor to add node
2. Search for "**Aliyun Invoice**" or "**阿里云发票核验**"
3. Select node and configure parameters

### 4. Configure Node Parameters

**Required Parameters**:
- **Invoice Number**: 8-20 digits
- **Invoice Date**: Format YYYYMMDD (e.g., 20231015)

**Optional Parameters**:
- **Invoice Code**: 10-12 digits (can be empty for digital e-invoices)
- **Invoice Amount**: Fill in corresponding amount based on invoice type
- **Verify Code**: Last 6 digits of verification code (required for certain invoice types)
- **Invoice Kind**: Normal invoice (0) or Blockchain invoice (1)

## 📋 Invoice Type Guide

Parameter requirements for different invoice types:

| Type Code | Invoice Name | Invoice Code | Amount | Verify Code |
|-----------|--------------|--------------|--------|-------------|
| 01 | VAT Special Invoice | Required | Excl. Tax | Optional |
| 03 | Motor Vehicle Invoice (Special) | Required | Excl. Tax | Optional |
| 04 | VAT Ordinary Invoice (Roll) | Required | Excl. Tax | **Required** |
| 10 | VAT E-Invoice | Required | Excl. Tax | **Required** |
| 11 | VAT Ordinary Invoice | Required | Excl. Tax | **Required** |
| 14 | Toll VAT E-Invoice | Required | Excl. Tax | **Required** |
| 15 | Used Car Invoice | Required | Total Price | Optional |
| 20 | Motor Vehicle Invoice | Required | Excl. Tax | Optional |
| 31 | Digital E-Invoice (Special) | Optional | Incl. Tax | Optional |
| 32 | Digital E-Invoice (Ordinary) | Optional | Incl. Tax | Optional |
| Blockchain | Blockchain Invoice | Required | Excl. Tax | **Required** |

## 📤 Return Data Structure

The node returns a JSON object containing complete invoice information:

```json
{
  "success": true,
  "requestId": "55B2BB6D-EA14-5828-AB61-3CE168377D64",
  "responseCode": "001",
  "responseMessage": "success",
  "responseDescription": "Success",
  "charged": true,
  "invoice": {
    "invoiceType": "01",
    "invoiceCode": "011001801234",
    "invoiceNumber": "35314567",
    "invoiceDate": "20231015",
    "checkCode": "123456",
    "verificationResult": "Matched",
    "inspectionAmount": "1",
    "invalidMark": "N",
    "invoiceMoney": "322.33",
    "allTax": "20.95",
    "allValoremTax": "343.28",
    "purchaser": {
      "name": "Purchaser Company Name",
      "taxNumber": "91330100MA27XYZ123",
      "addressOrPhone": "123 Street, Hangzhou 0571-12345678",
      "bankAndNumber": "Bank of China Hangzhou Branch 1234567890"
    },
    "saler": {
      "name": "Seller Company Name",
      "taxNumber": "91330106MA27ABC456",
      "addressOrPhone": "456 Avenue, Hangzhou 0571-87654321",
      "bankAndNumber": "ICBC Hangzhou Branch 0987654321"
    },
    "details": [
      {
        "goodsName": "Office Supplies",
        "detailAmount": "100.00",
        "taxRate": "0.13",
        "allTax": "13.00"
      }
    ],
    "machineCode": "499098765432",
    "note": "Notes"
  }
}
```

### Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Verification success (`true` for success) |
| `responseCode` | string | Business response code (see status codes below) |
| `responseMessage` | string | Response message |
| `responseDescription` | string | Chinese description of response code |
| `charged` | boolean | **Charging status** (`true` means this call incurs charges) |
| `invoice` | object | Detailed invoice information |

## 🔢 Status Codes

### ✅ Success Status (Charged)

| Code | Description | Charged |
|------|-------------|---------|
| 001 | Success | ✅ Yes |
| 000000 | Success | ✅ Yes |

### ⚠️ Invoice Status (Partially Charged)

| Code | Description | Charged |
|------|-------------|---------|
| 006 | Invoice information mismatch | ⚠️ **Yes** |
| 009 | Invoice not found | ⚠️ **Yes** |
| 1005 | Please check if four elements comply with regulations | ⚠️ **Yes** |

> ⚠️ **Important**: Even if verification fails, the above status codes will still incur charges!

### 🚫 Parameter Errors (Not Charged)

| Code | Description |
|------|-------------|
| 110-114 | Parameter format errors |
| 111000-111001 | Parameter validation errors |

### ⏱️ Verification Limits (Not Charged)

| Code | Description |
|------|-------------|
| 002 | Exceeded daily verification limit for this invoice |
| 104 | Exceeded maximum verification volume |
| 10017 | Cannot verify invoices over five years old |

### 🔐 Permission Related (Not Charged)

| Code | Description |
|------|-------------|
| 131002-131005 | Interface permission or throttling errors |
| 10020 | No verification permission |

For complete status code list, see [Status Code Documentation](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifyvatinvoice).

## 💡 Usage Examples

### Example 1: Single Invoice Verification

```
Manual Trigger → Aliyun Invoice Verifier → Check success → Process Result
```

### Example 2: Batch Invoice Verification

```
Read Excel → Loop Through Rows → Aliyun Invoice Verifier → Collect Results → Export Report
```

### Example 3: Invoice Verification with Notification

```
Webhook → Aliyun Invoice Verifier → IF Node → Success: Send Email / Failure: Log Error
```

### Example 4: Cost Control Based on Charging Status

```
Aliyun Invoice Verifier → Switch Node (based on charged field)
  → charged=true + success=true: Normal processing
  → charged=true + success=false: Log as charged failure, send alert
  → charged=false: Parameter error, don't retry
```

## ⚙️ Advanced Configuration

### Environment Variables

To customize API endpoint, configure in credentials or set via environment variable:

```bash
ALIYUN_OCR_ENDPOINT=ocr-api.cn-shanghai.aliyuncs.com
```

### Error Handling

The node supports n8n's "Continue on Fail" mode. When enabled, the workflow will continue even if verification fails, with error information included in the output.

## 💰 Cost Control Recommendations

1. **Pre-validate Parameters**: Validate parameter formats before calling API to avoid unnecessary charges
2. **Result Caching**: Cache successfully verified invoices to avoid duplicate verifications
3. **Deduplication**: Deduplicate before batch processing to avoid verifying the same invoice multiple times
4. **Monitor Charges**: Use the `charged` field to track actual costs
5. **Retry Strategy**:
   - Parameter errors (110-114) → Don't retry
   - System exceptions (106, 121xxx) → Can retry
   - Charged failures (006, 009, 1005) → Don't retry, notify user

## 🔧 Development & Debugging

### Local Development

```bash
# Clone repository
git clone https://github.com/CozeBoy/n8n-nodes-aliyuninvoiceverifier.git
cd n8n-nodes-aliyuninvoiceverifier

# Install dependencies
npm install

# Build
npm run build

# Link to n8n
npm link
cd ~/.n8n
npm link n8n-nodes-aliyuninvoiceverifier

# Restart n8n
n8n start
```

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Nodes Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
- [Aliyun OCR Documentation](https://help.aliyun.com/zh/ocr/)
- [Aliyun Invoice Verification API](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifyvatinvoice)

## ❓ FAQ

### Q: What invoice types are supported?
A: Supports VAT special invoices, ordinary invoices, e-invoices, digital e-invoices, motor vehicle invoices, used car invoices, blockchain invoices, etc.

### Q: Why am I charged even when verification fails?
A: Aliyun API charges for cases where the invoice exists but information doesn't match (status codes 006, 009, 1005). This is normal business behavior.

### Q: How to avoid duplicate verifications?
A: It's recommended to add deduplication logic in your workflow or use a database to track verified invoices.

### Q: Can't find the node after installation?
A: Please check: 1) n8n has been restarted; 2) Check n8n logs for loading errors; 3) Clear browser cache.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

[MIT License](LICENSE.md)

## 🙏 Acknowledgments

- Thanks to [n8n](https://n8n.io/) for providing an excellent workflow automation platform
- Thanks to [Aliyun](https://www.aliyun.com/) for providing invoice verification API service

## 📧 Contact

For questions or suggestions, please contact via:

- Submit Issue: [GitHub Issues](https://github.com/CozeBoy/n8n-nodes-aliyuninvoiceverifier/issues)
- Email: your.email@example.com

---

**⭐ If this project helps you, please give it a Star!**

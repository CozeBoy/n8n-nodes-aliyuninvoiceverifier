"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidMark = exports.InvoiceKind = void 0;
var InvoiceKind;
(function (InvoiceKind) {
    InvoiceKind[InvoiceKind["Normal"] = 0] = "Normal";
    InvoiceKind[InvoiceKind["Blockchain"] = 1] = "Blockchain";
})(InvoiceKind || (exports.InvoiceKind = InvoiceKind = {}));
var InvalidMark;
(function (InvalidMark) {
    InvalidMark["Normal"] = "N";
    InvalidMark["Invalid"] = "Y";
    InvalidMark["RedFlushed"] = "H";
    InvalidMark["PartialRedFlushed"] = "7";
    InvalidMark["FullRedFlushed"] = "8";
})(InvalidMark || (exports.InvalidMark = InvalidMark = {}));
//# sourceMappingURL=invoice.types.js.map
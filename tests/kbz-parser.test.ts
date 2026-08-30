import { describe, expect, it } from "vitest";
import { parseKbzPayment } from "../lib/kbz-parser";

describe("parseKbzPayment", () => {
  it.each([
    ["120,000.00", "25/08/2026", "01004254061828424666", "424666"],
    ["100,000.00", "26/08/2026", "01004255001895128380", "128380"],
    ["101,000.00", "29/08/2026", "01004258060011717896", "717896"],
  ])("parses %s", (amount, date, txnId, last6) => {
    expect(parseKbzPayment(`(KBZPay) Dear KBZPay partner, you\nreceived payment of ${amount} Ks\non ${date}. Txn ID: ${txnId}.`)).toEqual({ amount: Number(amount.replace(",", "")), paymentDate: date, txnId, txnLast6: last6 });
  });
  it("handles spacing and case", () => expect(parseKbzPayment("DEAR kbzpay PARTNER, received PAYMENT of 500.00 Ks on 29/08/2026. TXN ID: 000123456789")?.txnLast6).toBe("456789"));
  it.each(["KBZPay hello", "Dear KBZPay partner, your account is updated", "Dear KBZPay partner, received payment of 1,000 Ks on 29/08/2026. Txn ID: ABC123"])("rejects invalid SMS: %s", (body) => expect(parseKbzPayment(body)).toBeNull());
});

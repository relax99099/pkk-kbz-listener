export type ParsedKbzPayment = { amount: number; paymentDate: string; txnId: string; txnLast6: string };

export function normalizeSmsBody(body: string) { return body.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim(); }

export function parseKbzPayment(body: string): ParsedKbzPayment | null {
  const normalized = normalizeSmsBody(body);
  const match = normalized.match(/dear\s+kbzpay\s+partner[\s\S]*?received\s+payment\s+of\s+([\d,]+(?:\.\d{1,2})?)\s*ks[\s\S]*?on\s+(\d{2}\/\d{2}\/\d{4})[\s\S]*?txn\s*id\s*:\s*([0-9]{6,})/i);
  if (!match) return null;
  const amount = Number(match[1].replace(/,/g, ""));
  const txnId = match[3];
  if (!Number.isFinite(amount) || !/^\d{6,}$/.test(txnId)) return null;
  return { amount, paymentDate: match[2], txnId, txnLast6: txnId.slice(-6) };
}

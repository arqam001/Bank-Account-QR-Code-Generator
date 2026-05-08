// shared/banks.js
// Pakistani bank codes (SWIFT/Raast identifiers) and metadata

export const PAKISTANI_BANKS = [
  { code: "UNIL", name: "United Bank Limited", shortName: "UBL", raastEnabled: true },
  { code: "HABB", name: "Habib Bank Limited", shortName: "HBL", raastEnabled: true },
  { code: "MUCB", name: "MCB Bank Limited", shortName: "MCB", raastEnabled: true },
  { code: "MEZN", name: "Meezan Bank", shortName: "Meezan", raastEnabled: true },
  { code: "ALFH", name: "Bank Alfalah", shortName: "Alfalah", raastEnabled: true },
  { code: "BAHL", name: "Bank Al Habib", shortName: "Al Habib", raastEnabled: true },
  { code: "NBPA", name: "National Bank of Pakistan", shortName: "NBP", raastEnabled: false },
  { code: "ASCM", name: "Askari Bank", shortName: "Askari", raastEnabled: false },
  { code: "JSBL", name: "JS Bank", shortName: "JS Bank", raastEnabled: false },
  { code: "FAYS", name: "Faysal Bank", shortName: "Faysal", raastEnabled: false },
  { code: "SAUD", name: "Saudi Pak Bank", shortName: "Saudi Pak", raastEnabled: false },
  { code: "SUMB", name: "Summit Bank", shortName: "Summit", raastEnabled: false },
];

export function detectBankFromIBAN(iban) {
  const clean = iban.replace(/\s/g, "").toUpperCase();
  if (!clean.startsWith("PK") || clean.length !== 24) return null;
  const code = clean.substring(4, 8);
  return PAKISTANI_BANKS.find((b) => b.code === code) || null;
}

export function validatePakistaniIBAN(iban) {
  const clean = iban.replace(/\s/g, "").toUpperCase();
  return /^PK\d{2}[A-Z]{4}\d{16}$/.test(clean);
}

export function formatIBAN(iban) {
  const clean = iban.replace(/\s/g, "").toUpperCase();
  return clean.match(/.{1,4}/g)?.join(" ") || clean;
}

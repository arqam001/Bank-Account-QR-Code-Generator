// shared/raast.js
// Builds a Raast-compliant EMVCo QR payload for Pakistani instant payments.
// Spec reference: SBP Raast P2M QR Code Specification v1.0

function tlv(tag, value) {
  const len = String(value.length).padStart(2, "0");
  return `${tag}${len}${value}`;
}

function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function buildRaastQRPayload({ iban, accountTitle, merchantCity = "KARACHI", amount = 0, referenceId = "", fallbackUrl = "" }) {
  const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();
  const tag00 = tlv("00", "01");
  const tag01 = tlv("01", amount > 0 ? "12" : "11");
  const merchantAccountInfo = tlv("00", "pk.gov.sbp") + tlv("02", cleanIBAN);
  const tag26 = tlv("26", merchantAccountInfo);
  const tag52 = tlv("52", "0000");
  const tag53 = tlv("53", "586");
  const tag54 = amount > 0 ? tlv("54", amount.toFixed(2)) : "";
  const tag58 = tlv("58", "PK");
  const tag59 = tlv("59", accountTitle.substring(0, 25));
  const tag60 = tlv("60", merchantCity.substring(0, 15));
  let tag62 = "";
  if (referenceId) {
    tag62 = tlv("62", tlv("05", referenceId.substring(0, 25)));
  }
  let tag26Final = tag26;
  if (fallbackUrl) {
    const merchantAccountInfoWithUrl = tlv("00", "pk.gov.sbp") + tlv("02", cleanIBAN) + tlv("07", fallbackUrl.substring(0, 99));
    tag26Final = tlv("26", merchantAccountInfoWithUrl);
  }
  const payloadWithoutCRC = tag00 + tag01 + tag26Final + tag52 + tag53 + tag54 + tag58 + tag59 + tag60 + tag62 + "6304";
  return payloadWithoutCRC + crc16(payloadWithoutCRC);
}

export function parseEMVCoPayload(payload) {
  const result = {};
  let i = 0;
  while (i < payload.length - 4) {
    const tag = payload.substring(i, i + 2);
    const len = parseInt(payload.substring(i + 2, i + 4), 10);
    const value = payload.substring(i + 4, i + 4 + len);
    result[tag] = value;
    i += 4 + len;
  }
  result["crc"] = payload.substring(payload.length - 4);
  return result;
}

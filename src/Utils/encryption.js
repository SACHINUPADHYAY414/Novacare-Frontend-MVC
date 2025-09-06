import CryptoJS from "crypto-js";

const secretKey = "lIpNCz3u91RyzQC3XOl+Fji8PzYsmLciBmut4Q7p77o="; // 256-bit base64

export const encrypt = (data) => {
  const ivArray = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = CryptoJS.lib.WordArray.create(ivArray);
  const key = CryptoJS.enc.Base64.parse(secretKey);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const payload = {
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(), // Already Base64
  };

  return btoa(JSON.stringify(payload)); // Final encoded string
};

export const decrypt = (encryptedStr) => {
  try {
    const decodedStr = atob(encryptedStr);
    const parsed = JSON.parse(decodedStr);

    const key = CryptoJS.enc.Base64.parse(secretKey);
    const iv = CryptoJS.enc.Base64.parse(parsed.iv);

    const decrypted = CryptoJS.AES.decrypt(parsed.data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption failed:", err.message);
    return null;
  }
};

import React, { useState } from "react";
import bigInt from "big-integer";
import CryptoJS from "crypto-js";

const generateKeys = (bitLength = 512, p, g) => {
  if (!p || !g) {
    p = bigInt.randBetween(
      bigInt(2).pow(bitLength - 1),
      bigInt(2).pow(bitLength)
    );
    g = bigInt(2);
  }
  const x = bigInt.randBetween(1, p.subtract(2));
  const y = g.modPow(x, p);

  return {
    publicKey: { p, g, y },
    privateKey: { p, g, x },
  };
};

const stringToBigInt = (str) => {
  const hexString = CryptoJS.enc.Utf8.parse(str).toString(CryptoJS.enc.Hex);
  return bigInt(hexString, 16);
};

const bigIntToString = (bigIntVal) => {
  const hexString = bigIntVal.toString(16);
  return CryptoJS.enc.Hex.parse(hexString).toString(CryptoJS.enc.Utf8);
};

const encrypt = (message, publicKey) => {
  const { p, g, y } = publicKey;
  const m = stringToBigInt(message);
  const k = bigInt.randBetween(1, p.subtract(2));
  const a = g.modPow(k, p);
  const b = m.multiply(y.modPow(k, p)).mod(p);

  return { a, b };
};

const decrypt = (ciphertext, privateKey) => {
  const { a, b } = ciphertext;
  const { p, x } = privateKey;
  const s = a.modPow(x, p);
  const sInv = s.modInv(p);
  const m = b.multiply(sInv).mod(p);

  return bigIntToString(m);
};

const ElGamalEncryption = () => {
  const [keys, setKeys] = useState(null);
  const [message, setMessage] = useState("");
  const [ciphertext, setCiphertext] = useState(null);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [pValue, setPValue] = useState("");
  const [gValue, setGValue] = useState("");

  const handleGenerateKeys = () => {
    const p = pValue ? bigInt(pValue) : null;
    const g = gValue ? bigInt(gValue) : null;
    const generatedKeys = generateKeys(512, p, g);
    setKeys(generatedKeys);
    setCiphertext(null);
    setDecryptedMessage("");
  };

  const handleEncrypt = () => {
    if (keys && message) {
      const encrypted = encrypt(message, keys.publicKey);
      setCiphertext(encrypted);
      setDecryptedMessage("");
    }
  };

  const handleDecrypt = () => {
    if (keys && ciphertext) {
      const decrypted = decrypt(ciphertext, keys.privateKey);
      setDecryptedMessage(decrypted);
    }
  };

  return (
    <div className="px-8 py-4 flex flex-col">
      <div>
        <label>
          p:
          <input
            type="text"
            className="ft_input"
            value={pValue}
            onChange={(e) => setPValue(e.target.value)}
          />
        </label>
        <label>
          g:
          <input
            type="text"
            className="ft_input"
            value={gValue}
            onChange={(e) => setGValue(e.target.value)}
          />
        </label>
        <button onClick={handleGenerateKeys} className="ft_input">
          Сгенерировать ключи
        </button>
        {keys && (
          <div className="my-4 border border-solid border-black px-4 py-2 rounded-lg">
            <h2>Публичный ключ</h2>
            <p className="break-words">p: {keys.publicKey.p.toString()}</p>
            <p className="break-words">g: {keys.publicKey.g.toString()}</p>
            <p className="break-words">y: {keys.publicKey.y.toString()}</p>
          </div>
        )}
      </div>
      <div className="field">
        <label>Сообщение:</label>
        <input
          type="text"
          className="ft_input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleEncrypt} className="ft_input">
          Зашифровать
        </button>
      </div>
      {ciphertext && (
        <div className="my-4 border border-solid border-black px-4 py-2 rounded-lg">
          <h2>Зашифрованное сообщение</h2>
          <p className="break-words">a: {ciphertext.a.toString()}</p>
          <p className="break-words">b: {ciphertext.b.toString()}</p>
          <button onClick={handleDecrypt} className="ft_input">
            Расшифровать
          </button>
        </div>
      )}
      {decryptedMessage && (
        <div className="my-4 border border-solid border-black px-4 py-2 rounded-lg">
          <h2>Расшифрованное сообщение</h2>
          <p className="break-words">{decryptedMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ElGamalEncryption;

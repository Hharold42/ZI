"use client";

import { useState } from "react";

const VigenereCipher = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");

  const encryptVigenere = (text, key) => {
    const alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const textChar = text[i].toUpperCase();
      if (alphabet.includes(textChar)) {
        const textIndex = alphabet.indexOf(textChar);
        const keyChar = key[keyIndex % key.length].toUpperCase();
        const keyIndexChar = alphabet.indexOf(keyChar);
        const encryptedChar =
          alphabet[(textIndex + keyIndexChar) % alphabet.length];
        result += encryptedChar;
        keyIndex++;
      } else {
        result += textChar;
      }
    }
    return result;
  };

  const handleEncrypt = () => {
    const result = encryptVigenere(text, key);
    setEncryptedText(result);
  };

  return (
    <div className="grid py-4 px-8 grid-cols-2 w-full gap-4">
      <div>
        <div className="field">
          <label className=" text-xl">Строка:</label>
          <input
            className=" ft_input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="field">
          <label className=" text-xl">Ключ:</label>
          <input
            className=" ft_input"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          onClick={handleEncrypt}
          className=" ft_input"
        >
          Шифровать
        </button>
        <div className=" text-xl">
          <h2>Зашифрованный текст:</h2>
          <p>{encryptedText}</p>
        </div>
      </div>
    </div>
  );
};

export default VigenereCipher;

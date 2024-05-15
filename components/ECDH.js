import React, { useState } from "react";
import bigInt from "big-integer";

// Функция для генерации случайного простого числа заданной длины
function generatePrime(length) {
  const min = bigInt(10).pow(length - 1);
  const max = bigInt(10).pow(length).minus(1);

  while (true) {
    const randomNumber = bigInt.randBetween(min, max);
    if (randomNumber.isProbablePrime()) {
      return randomNumber.toString();
    }
  }
}

// Параметры эллиптической кривой
const a = 0;
const b = 7;
const pLength = 5; // Оптимальная длина p для тестирования
const p = generatePrime(pLength); // Генерация случайного простого числа p
let basePoint = { x: "", y: "" }; // Базовая точка G

// Функция, вычисляющая точку на кривой
function computePoint(x) {
  const y2 = (x ** 3 + a * x + b) % p;
  let y = null;
  for (let i = 0; i < p; i++) {
    if (i ** 2 % p === y2) {
      y = i;
      break;
    }
  }
  return { x, y };
}

function ECCComponent() {
  const [alicePrivateKey, setAlicePrivateKey] = useState("");
  const [alicePublicKey, setAlicePublicKey] = useState("");
  const [bobPrivateKey, setBobPrivateKey] = useState("");
  const [bobPublicKey, setBobPublicKey] = useState("");
  const [sharedSecret, setSharedSecret] = useState("");
  const [basePointX, setBasePointX] = useState(basePoint.x);
  const [basePointY, setBasePointY] = useState(basePoint.y);

  // Функция для генерации новой базовой точки G
  const generateBasePoint = () => {
    const x = Math.floor(Math.random() * (parseInt(p) - 1)) + 1;
    const { y } = computePoint(x);
    basePoint = { x, y };
    setBasePointX(x.toString());
    setBasePointY(y.toString());
  };

  const generateKeys = () => {
    // Генерация закрытых ключей для Алисы и Боба
    const alicePrivateKeyValue = bigInt
      .randBetween(bigInt(1), bigInt(p).minus(1))
      .toString();
    const bobPrivateKeyValue = bigInt
      .randBetween(bigInt(1), bigInt(p).minus(1))
      .toString();
    setAlicePrivateKey(alicePrivateKeyValue);
    setBobPrivateKey(bobPrivateKeyValue);

    // Вычисление открытых ключей
    const alicePublicKeyPoint = computePoint(
      parseInt(alicePrivateKeyValue),
      parseInt(alicePrivateKeyValue)
    );
    const bobPublicKeyPoint = computePoint(
      parseInt(bobPrivateKeyValue),
      parseInt(bobPrivateKeyValue)
    );
    setAlicePublicKey(
      `(${alicePublicKeyPoint.x}, ${alicePublicKeyPoint.y || "N/A"})`
    );
    setBobPublicKey(
      `(${bobPublicKeyPoint.x}, ${bobPublicKeyPoint.y || "N/A"})`
    );

    // Вычисление общего секрета
    const sharedSecretKey = computePoint(
      parseInt(alicePrivateKeyValue) * parseInt(basePointX),
      parseInt(alicePrivateKeyValue) * parseInt(basePointY)
    );
    setSharedSecret(`(${sharedSecretKey.x}, ${sharedSecretKey.y || "N/A"})`);
  };

  const checkConvergence = () => {
    const sharedSecretKey = computePoint(
      parseInt(alicePrivateKey) * parseInt(basePointX),
      parseInt(alicePrivateKey) * parseInt(basePointY)
    );
    const sharedSecretText = `(${sharedSecretKey.x}, ${
      sharedSecretKey.y || "N/A"
    })`;

    if (sharedSecretText === sharedSecret) {
      alert("Общий секрет совпадает!");
    } else {
      alert("Общий секрет не совпадает!");
    }
  };

  return (
    <div className="px-8 py-4 flex flex-col">
      <div className="field">
        <label>Приватный ключ Алисы:</label>
        <input
          type="text"
          className="ft_input"
          value={alicePrivateKey}
          readOnly
        />
      </div>
      <div className="field">
        <label>Публичный ключ Алисы:</label>
        <input
          type="text"
          className="ft_input"
          value={alicePublicKey}
          readOnly
        />
      </div>
      <div className="field">
        <label>Приватный ключ Боба:</label>
        <input
          type="text"
          className="ft_input"
          value={bobPrivateKey}
          readOnly
        />
      </div>
      <div className="field">
        <label>Публичный ключ Боба:</label>
        <input type="text" className="ft_input" value={bobPublicKey} readOnly />
      </div>
      <div className="field">
        <label>Базовая точка G (x):</label>
        <input
          type="number"
          value={basePointX}
          className="ft_input"
          onChange={(e) => setBasePointX(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Базовая точка G (y):</label>
        <input
          type="number"
          value={basePointY}
          className="ft_input"
          onChange={(e) => setBasePointY(e.target.value)}
        />
      </div>
      <div>
        <button onClick={generateBasePoint} className="ft_input">
          Сгенерировать новую точку G
        </button>
      </div>
      <div>
        <button onClick={generateKeys} className="ft_input">
          Сгенерировать ключи
        </button>
      </div>
      <div>
        <button onClick={checkConvergence} className="ft_input">
          Проверить сходимость общего ключа
        </button>
      </div>
      <div className="field">
        <label>Общий секрет:</label>
        <input type="text" className="ft_input" value={sharedSecret} readOnly />
      </div>
    </div>
  );
}

export default ECCComponent;

import React, { useState } from "react";
import bigInt from "big-integer";

const PrimeNumberChecker = () => {
  const [number, setNumber] = useState(0);
  const [iterations, setIterations] = useState(1);
  const [results, setResults] = useState([]);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function powerMod(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> 1n;
      base = (base * base) % modulus;
    }
    return result;
  }

  // Функция для вычисления символа Якоби (a/n)
  function jacobiSymbol(a, n) {
    if (n <= 0n || n % 2n === 0n) return 0n;
    if (a === 0n) return 0n;
    if (a === 1n) return 1n;
    if (a === 2n) {
      const residue = n % 8n;
      if (residue === 1n || residue === 7n) return 1n;
      if (residue === 3n || residue === 5n) return -1n;
    }
    if (a >= n) return jacobiSymbol(a % n, n);
    if (a % 2n === 0n) {
      return jacobiSymbol(2n, n) * jacobiSymbol(a / 2n, n);
    }
    if (a % 4n === 3n && n % 4n === 3n) {
      return -jacobiSymbol(n % a, a);
    }
    return jacobiSymbol(n % a, a);
  }

  // Функция для проверки простоты числа методом Соловея-Штрассена
  function isPrimeSolovayStrassen(strNum, iterations) {
    // Преобразование строки в BigInt
    const num = BigInt(strNum);

    // Базовые проверки
    if (num <= 1n) return { isPrime: false, time: 0 };
    if (num <= 3n) return { isPrime: true, time: 0 };

    const startTime = performance.now();

    // Выполняем iterations итераций проверки
    for (let i = 0; i < iterations; i++) {
      // Генерируем случайное число a в диапазоне [2, num - 1]
      const a = BigInt(getRandomInt(2, Number(num) - 1));

      // Вычисляем символ Якоби (a/num)
      const jacobi = jacobiSymbol(a, num);

      // Вычисляем a^((num - 1) / 2) mod num
      const modExp = powerMod(a, (num - 1n) / 2n, num);

      // Если a^((num - 1) / 2) mod num не равно символу Якоби (a/num), num точно составное
      if (modExp !== jacobi && modExp !== num - 1n)
        return { isPrime: false, time: performance.now() - startTime };
    }

    // Если ни одна из итераций не дала результата, считаем num вероятно простым
    return { isPrime: true, time: performance.now() - startTime };
  }

  const isPrimeFermat = (n, iterations) => {
    if (n <= 1) return { isPrime: false, time: 0 };
    if (n <= 3) return { isPrime: true, time: 0 };

    const startTime = performance.now();
    const witness = (a) => {
      return bigInt(a).modPow(bigInt(n).minus(1), n).eq(1);
    };

    for (let i = 0; i < iterations; i++) {
      const a = Math.floor(Math.random() * (n - 2)) + 2;
      if (!witness(a))
        return { isPrime: false, time: performance.now() - startTime };
    }
    return { isPrime: true, time: performance.now() - startTime };
  };

  const isPrimeMillerRabin = (n, iterations) => {
    if (n <= 1) return { isPrime: false, time: 0 };
    if (n <= 3) return { isPrime: true, time: 0 };

    const startTime = performance.now();

    const decompose = (n) => {
      let s = 0;
      let d = bigInt(n).minus(1);
      while (d.isEven()) {
        s++;
        d = d.divide(2);
      }
      return [s, d];
    };

    const witness = (a, s, d, n) => {
      let x = bigInt(a).modPow(d, n);
      if (x.eq(1) || x.eq(bigInt(n).minus(1))) return true;
      for (let i = 0; i < s - 1; i++) {
        x = x.modPow(2, n);
        if (x.eq(1)) return false;
        if (x.eq(bigInt(n).minus(1))) return true;
      }
      return false;
    };

    const [s, d] = decompose(n);
    for (let i = 0; i < iterations; i++) {
      const a = bigInt.randBetween(bigInt(2), bigInt(n).minus(1));
      if (!witness(a, s, d, n))
        return { isPrime: false, time: performance.now() - startTime };
    }
    return { isPrime: true, time: performance.now() - startTime };
  };

  const generatePrimeNumber = () => {
    let randomNumber = bigInt(0);
    while (!randomNumber.isProbablePrime()) {
      randomNumber = bigInt.randBetween(
        bigInt(2).pow(511), // Минимальное случайное число (512 бит)
        bigInt(2).pow(512).minus(1) // Максимальное случайное число (512 бит)
      );
    }
    setNumber(randomNumber.toString());
  };

  const handleCheckPrime = () => {
    const solovayStrassenResult = isPrimeSolovayStrassen(number, iterations);
    console.log(solovayStrassenResult);
    const fermatResult = isPrimeFermat(number, iterations);
    const millerRabinResult = isPrimeMillerRabin(number, iterations);
    setResults([
      `Соловея-Штрасса: ${
        solovayStrassenResult.isPrime ? "Простое" : "Составное"
      }, Время выполнения: ${solovayStrassenResult.time} мс`,
      `Теорема Ферма: ${
        fermatResult.isPrime ? "Простое" : "Составное"
      }, Время выполнения: ${fermatResult.time} мс`,
      `Миллера-Рабина: ${
        millerRabinResult.isPrime ? "Простое" : "Составное"
      }, Время выполнения: ${millerRabinResult.time} мс`,
    ]);
  };

  return (
    <div className="px-8 py-4 flex flex-col">
      <div className="field">
        <label>Число:</label>
        <input
          type="text"
          className="ft_input"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Количество итераций:</label>
        <input
          type="number"
          className="ft_input"
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value))}
        />
      </div>
      <button className="ft_input" onClick={handleCheckPrime}>
        Проверить на простоту
      </button>
      <button className="ft_input" onClick={generatePrimeNumber}>
        Сгенерировать число
      </button>
      <div>
        <h3>Результаты:</h3>
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PrimeNumberChecker;

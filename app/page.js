"use client";

import ECDHDemo from "@/components/ECDH";
import ElGamalEncryption from "@/components/ElGamal";
import PrimeNumberChecker from "@/components/PNC";
import VigenereCipher from "@/components/VigenereCipher";
import { useState } from "react";

export default function Home() {
  const [currPage, setCurrPage] = useState(<VigenereCipher />);

  return (
    <main className="flex flex-col justify-center align-middle p-[4rem]">
      <div className="rounded-md border-2 border-solid border-blue-300">
        <div className="w-full flex flex-row align-middle border-b border-solid border-blue-500">
          <div
            className="w-full px-4 py-2 hover:shadow-inner border-r text-center border-blue-500"
            onClick={() => setCurrPage(<VigenereCipher />)}
          >
            Шифр Виженера
          </div>
          <div
            className="w-full px-4 py-2 hover:shadow-inner border-r text-center border-blue-500"
            onClick={() => setCurrPage(<ElGamalEncryption />)}
          >
            Схема Эль-Гамаля
          </div>
          <div
            className="w-full px-4 py-2 hover:shadow-inner border-r text-center border-blue-500"
            onClick={() => setCurrPage(<PrimeNumberChecker />)}
          >
            Факторизация числа
          </div>
          <div
            className="w-full px-4 py-2 hover:shadow-inner border-r text-center border-blue-500"
            onClick={() => setCurrPage(<ECDHDemo />)}
          >
            Схема Эль-Гамаля на эллептических кривых
          </div>
        </div>
        {currPage}
      </div>
    </main>
  );
}

// TODO: ajustar json com os brawlers (ultra lendarios)
// TODO: Seleção de brawler diário
// TODO: Melhorar a UI
// TODO: Persistência de dados (localStorage)
// TODO: compartilhamento do resultado com emojis
// TODO: Animações com framer-motion
// TODO: ranking de acertos semanais

"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import brawlersData from "../data/brawlers.json";

interface Brawler {
  name: string;
  rarity: string;
  role: string;
  gender: string;
  releaseYear: number;
  imageUrl: string;
}

interface GuessResult {
  brawler: Brawler;
  correctness: {
    name: boolean;
    rarity: boolean;
    role: boolean;
    gender: boolean;
    releaseYear: "correct" | "higher" | "lower" | "incorrect";
  };
}

export default function Home() {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [suggestions, setSuggestions] = useState<Brawler[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Simplificado - em um jogo real, você teria mais brawlers
  const brawlers: Brawler[] = brawlersData;

  // Em um jogo real, isso seria aleatório ou predefinido por dia
  const targetBrawler = brawlers[0];

  useEffect(() => {
    if (currentGuess.length > 0) {
      const filtered = brawlers.filter(brawler =>
        brawler.name.toLowerCase().includes(currentGuess.toLowerCase())
      ).slice(0, 5);

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentGuess, brawlers]);

  const handleGuess = () => {
    const guessedBrawler = brawlers.find(b => b.name.toLowerCase() === currentGuess.toLowerCase());

    if (!guessedBrawler) {
      alert("Brawler não encontrado!");
      return;
    }

    const result: GuessResult = {
      brawler: guessedBrawler,
      correctness: {
        name: guessedBrawler.name === targetBrawler.name,
        rarity: guessedBrawler.rarity === targetBrawler.rarity,
        role: guessedBrawler.role === targetBrawler.role,
        gender: guessedBrawler.gender === targetBrawler.gender,
        releaseYear: guessedBrawler.releaseYear === targetBrawler.releaseYear
          ? "correct"
          : guessedBrawler.releaseYear > targetBrawler.releaseYear
            ? "higher"
            : "lower"
      }
    };

    if (guessedBrawler.name === targetBrawler.name) {
      setGameWon(true);
    }

    setGuesses([...guesses, result]);
    setCurrentGuess("");
  };

  const selectSuggestion = (brawlerName: string) => {
    setCurrentGuess(brawlerName);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-900 text-white p-4">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-blue-700">
        <button onClick={() => setShowRules(!showRules)}
                className="rounded-full bg-yellow-400 text-blue-900 font-bold w-10 h-10 flex items-center justify-center shadow-lg hover:scale-105 transition">
          ?
        </button>

        <h1 className="text-3xl md:text-5xl font-black text-yellow-400 tracking-wide">
          BRAWL<span className="text-red-500">DLE</span>
        </h1>

        <span className="text-yellow-300 font-semibold">#1</span>
      </header>


      {showRules && (
        <div className="bg-blue-800 border border-blue-700 p-5 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-3">Como jogar:</h2>
          <ul className="space-y-2 list-disc pl-6 text-sm">
            <li>Adivinhe o brawler secreto do dia em até 6 tentativas.</li>
            <li>Cada palpite deve ser um brawler válido.</li>
            <li>
              <span className="bg-green-500 text-white px-2 py-0.5 rounded">Verde</span> = Correto
            </li>
            <li>
              <span className="bg-yellow-400 text-black px-2 py-0.5 rounded">Amarelo</span> = Maior ou menor
            </li>
            <li>
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded">Cinza</span> = Incorreto
            </li>
          </ul>
          <button
            onClick={() => setShowRules(false)}
            className="mt-4 px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-full transition"
          >
            Entendi!
          </button>
        </div>
      )}


      {gameWon ? (
        <div className="text-center py-8 bg-green-700 rounded-lg mb-6">
          <h2 className="text-3xl font-bold mb-2">Parabéns!</h2>
          <p>Você acertou em {guesses.length} tentativas!</p>
          <div className="my-4">
            <Image
              src={targetBrawler.imageUrl}
              alt={targetBrawler.name}
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-6 py-3 rounded-full mt-4">
            Compartilhar Resultado
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-xl relative mb-6">
            <input
              className="w-full p-4 rounded-t-xl text-black text-lg focus:outline-none"
              type="text"
              placeholder="Digite o nome do Brawler..."
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              onFocus={() => currentGuess.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            <button
              className="absolute top-0 right-0 px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-tr-xl rounded-bl-xl transition"
              onClick={handleGuess}
              disabled={!currentGuess || gameWon}
            >
              Enviar
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white text-black rounded-b-xl shadow-md overflow-hidden">
                {suggestions.map((b, i) => (
                  <div key={i} onClick={() => selectSuggestion(b.name)}
                       className="flex items-center p-2 hover:bg-gray-100 cursor-pointer gap-3">
                    <Image src={b.imageUrl} alt={b.name} width={32} height={32} className="rounded-full"/>
                    <span className="text-sm">{b.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      <div className="flex flex-col gap-2 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-5 gap-2 font-bold text-center text-sm">
          <div>Brawler</div>
          <div>Raridade</div>
          <div>Função</div>
          <div>Gênero</div>
          <div>Ano</div>
        </div>

        {guesses.map((guess, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 text-center">
            <div
              className={`flex items-center justify-center p-2 rounded ${guess.correctness.name ? 'bg-green-500' : 'bg-gray-700'}`}>
              <Image
                src={guess.brawler.imageUrl}
                alt={guess.brawler.name}
                width={30}
                height={30}
                className="mr-1"
              />
              <span className="text-xs">{guess.brawler.name}</span>
            </div>
            <div
              className={`p-2 rounded flex items-center justify-center ${guess.correctness.rarity ? 'bg-green-500' : 'bg-gray-700'}`}>
              {guess.brawler.rarity}
            </div>
            <div
              className={`p-2 rounded flex items-center justify-center ${guess.correctness.role ? 'bg-green-500' : 'bg-gray-700'}`}>
              {guess.brawler.role}
            </div>
            <div
              className={`p-2 rounded flex items-center justify-center ${guess.correctness.gender ? 'bg-green-500' : 'bg-gray-700'}`}>
              {guess.brawler.gender}
            </div>
            <div className={`p-2 rounded flex items-center justify-center ${
              guess.correctness.releaseYear === "correct"
                ? 'bg-green-500'
                : guess.correctness.releaseYear === "higher"
                  ? 'bg-yellow-500 text-black'
                  : guess.correctness.releaseYear === "lower"
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700'
            }`}>
              {guess.brawler.releaseYear}
              {guess.correctness.releaseYear === "higher" && <span>↓</span>}
              {guess.correctness.releaseYear === "lower" && <span>↑</span>}
            </div>
          </div>
        ))}

        {/* Linhas vazias para tentativas futuras */}
        {Array.from({length: 6 - guesses.length}).map((_, index) => (
          <div key={`empty-${index}`} className="grid grid-cols-5 gap-2 text-center">
            {Array.from({length: 5}).map((_, cellIndex) => (
              <div key={`empty-cell-${cellIndex}`} className="p-3 rounded bg-blue-800 h-12"></div>
            ))}
          </div>
        ))}
      </div>

      <footer className="mt-auto pt-6 text-center text-sm text-blue-300">
        <p>Um novo Brawldle estará disponível amanhã!</p>
        <p className="mt-2">© 2024 BrawlDle - Não oficial, feito por fãs</p>
      </footer>
    </div>
  );
}
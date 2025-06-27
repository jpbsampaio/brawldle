// TODO: ajustar json com os brawlers
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
      <header className="flex justify-between items-center mb-6 border-b border-blue-700 pb-4">
        <div className="flex-1">
          <button onClick={() => setShowRules(!showRules)} className="rounded-full bg-yellow-500 p-2">
            <span className="text-blue-900 font-bold">?</span>
          </button>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-center flex-grow text-yellow-400">
          BRAWL<span className="text-red-500">DLE</span>
        </h1>

        <div className="flex-1 flex justify-end">
        <span className="text-yellow-400">
          #1
        </span>
        </div>
      </header>

      {showRules && (
        <div className="bg-blue-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2 text-yellow-400">Como jogar:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adivinhe o brawler secreto do dia em 6 tentativas.</li>
            <li>Cada palpite deve ser um brawler válido do Brawl Stars.</li>
            <li>Após cada palpite, as cores mudarão para mostrar o quão perto seu palpite está.</li>
            <li><span className="bg-green-500 px-1 rounded">Verde</span> significa correto!</li>
            <li><span className="bg-yellow-500 px-1 rounded text-black">Amarelo</span> com seta significa que o valor
              real é maior ou menor.
            </li>
            <li><span className="bg-gray-700 px-1 rounded">Cinza</span> significa incorreto.</li>
          </ul>
          <button
            onClick={() => setShowRules(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3"
          >
            Fechar
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
          <div className="w-full max-w-lg flex mb-4 relative">
            <input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              placeholder="Digite o nome de um brawler..."
              className="flex-grow rounded-l-lg p-3 text-black"
              disabled={gameWon}
              onFocus={() => currentGuess.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            <button
              onClick={handleGuess}
              disabled={gameWon || !currentGuess}
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-6 py-3 rounded-r-lg"
            >
              Enviar
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-black rounded shadow-lg z-10">
                <ul>
                  {suggestions.map((brawler, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(brawler.name)}
                    >
                      <div className="w-8 h-8 mr-2 relative overflow-hidden rounded-full">
                        <Image
                          src={brawler.imageUrl}
                          alt={brawler.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span>{brawler.name}</span>
                    </li>
                  ))}
                </ul>
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
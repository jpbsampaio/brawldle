// TODO: Ajustar a finalização do jogo (Atualmente o jogo não finaliza após vitória ou derrota)
// TODO: Melhorar a UI (+/-)
// TODO: compartilhamento do resultado com emojis
// TODO: Animações com framer-motion

"use client";

import { useEffect, useState } from "react";
import brawlersData from "../data/brawlers.json";
import { Toast } from "@/components/Toast";
import { Header } from "@/components/Header";
import { RulesModal } from "@/components/RulesModal";
import { ResultModal } from "@/components/ResultModal";
import { GuessInput } from "@/components/GuessInput";
import { BrawlerGuessGrid } from "@/components/BrawlerGuessGrid";
import { Footer } from "@/components/Footer";

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
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error" as "error" | "success" | "warning",
  });

  const brawlers: Brawler[] = brawlersData;
  const targetBrawler = getTargetBrawler();

  function getTargetBrawler(): Brawler {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
      seed = (seed << 5) - seed + dateString.charCodeAt(i);
      seed = seed & seed;
    }
    const index = Math.abs(seed) % brawlers.length;
    return brawlers[index];
  }

  function getCurrentDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDate = localStorage.getItem("brawldle-date");
      const currentDate = getCurrentDate();

      if (savedDate === currentDate) {
        const savedGuesses = localStorage.getItem("brawldle-guesses");
        const savedGameWon = localStorage.getItem("brawldle-won");

        if (savedGuesses) {
          setGuesses(JSON.parse(savedGuesses));
        }

        if (savedGameWon === "true") {
          setGameWon(true);
        }
      } else {
        localStorage.setItem("brawldle-date", currentDate);
        localStorage.removeItem("brawldle-guesses");
        localStorage.removeItem("brawldle-won");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && guesses.length > 0) {
      localStorage.setItem("brawldle-guesses", JSON.stringify(guesses));
      localStorage.setItem("brawldle-won", gameWon.toString());
      localStorage.setItem("brawldle-date", getCurrentDate());

      if (guesses.length >= 6 && !gameWon) {
        setShowDefeatModal(true);
      }
    }
  }, [guesses, gameWon]);

  const showToastMessage = (message: string, type: "error" | "success" | "warning") => {
    setToast({
      visible: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleGuess = () => {
    if (gameWon || guesses.length >= 6) {
      showToastMessage(
        gameWon ? "Você já acertou o brawler do dia!" : "Você já usou todas as tentativas!",
        "warning"
      );
      return;
    }

    const guessedBrawler = brawlers.find(
      (b) => b.name.toLowerCase() === currentGuess.toLowerCase()
    );

    if (!guessedBrawler) {
      showToastMessage("Brawler não encontrado!", "error");
      return;
    }

    const alreadyGuessed = guesses.some(
      (g) => g.brawler.name.toLowerCase() === guessedBrawler.name.toLowerCase()
    );

    if (alreadyGuessed) {
      showToastMessage("Você já tentou este brawler!", "warning");
      return;
    }

    const result: GuessResult = {
      brawler: guessedBrawler,
      correctness: {
        name: guessedBrawler.name === targetBrawler.name,
        rarity: guessedBrawler.rarity === targetBrawler.rarity,
        role: guessedBrawler.role === targetBrawler.role,
        gender: guessedBrawler.gender === targetBrawler.gender,
        releaseYear:
          guessedBrawler.releaseYear === targetBrawler.releaseYear
            ? "correct"
            : guessedBrawler.releaseYear > targetBrawler.releaseYear
              ? "higher"
              : guessedBrawler.releaseYear < targetBrawler.releaseYear
                ? "lower"
                : "incorrect",
      },
    };

    if (guessedBrawler.name === targetBrawler.name) {
      setGameWon(true);
    }

    setAnimatingIndex(guesses.length);
    setGuesses([...guesses, result]);
    setCurrentGuess("");

    setTimeout(() => setAnimatingIndex(null), 600);
  };

  const handleSelectBrawler = (brawlerName: string) => {
    const guessedBrawler = brawlers.find(
      (b) => b.name.toLowerCase() === brawlerName.toLowerCase()
    );

    if (!guessedBrawler) return;

    const alreadyGuessed = guesses.some(
      (g) => g.brawler.name.toLowerCase() === guessedBrawler.name.toLowerCase()
    );

    if (alreadyGuessed) {
      showToastMessage("Você já tentou este brawler!", "warning");
      return;
    }

    const result: GuessResult = {
      brawler: guessedBrawler,
      correctness: {
        name: guessedBrawler.name === targetBrawler.name,
        rarity: guessedBrawler.rarity === targetBrawler.rarity,
        role: guessedBrawler.role === targetBrawler.role,
        gender: guessedBrawler.gender === targetBrawler.gender,
        releaseYear:
          guessedBrawler.releaseYear === targetBrawler.releaseYear
            ? "correct"
            : guessedBrawler.releaseYear > targetBrawler.releaseYear
              ? "higher"
              : guessedBrawler.releaseYear < targetBrawler.releaseYear
                ? "lower"
                : "incorrect",
      },
    };

    if (guessedBrawler.name === targetBrawler.name) {
      setGameWon(true);
    }

    setAnimatingIndex(guesses.length);
    setGuesses([...guesses, result]);
    setCurrentGuess("");

    setTimeout(() => setAnimatingIndex(null), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* fundo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Toast */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({...prev, visible: false}))}
        />

        {/* Header */}
        <Header onShowRules={() => setShowRules(!showRules)} />

        {/* Modal de regras */}
        <RulesModal
          visible={showRules}
          onClose={() => setShowRules(false)}
        />

        {/* Modal de resultado (vitória/derrota) */}
        <ResultModal
          visible={gameWon}
          onClose={() => setGameWon(false)}
          brawler={targetBrawler}
          guessCount={guesses.length}
          isWin={true}
        />

        <ResultModal
          visible={showDefeatModal}
          onClose={() => setShowDefeatModal(false)}
          brawler={targetBrawler}
          guessCount={guesses.length}
          isWin={false}
        />

        {/* Input */}
        {!gameWon && (
          <GuessInput
            brawlers={brawlers}
            currentGuess={currentGuess}
            setCurrentGuess={setCurrentGuess}
            onGuess={handleGuess}
            onSelectBrawler={handleSelectBrawler} // Nova prop
            isDisabled={gameWon || guesses.length >= 6}
          />
        )}

        {/* Grid do jogo */}
        <BrawlerGuessGrid
          guesses={guesses}
          animatingIndex={animatingIndex}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
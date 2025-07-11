"use client";

import {useEffect, useState} from "react";
import brawlersData from "../data/brawlers.json";
import {Toast} from "@/components/Toast";
import {Header} from "@/components/Header";
import {RulesModal} from "@/components/RulesModal";
import {ResultModal} from "@/components/ResultModal";
import {GuessInput} from "@/components/GuessInput";
import {BrawlerGuessGrid} from "@/components/BrawlerGuessGrid";
import {Footer} from "@/components/Footer";
import posthog from "posthog-js";

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
  const [showWinModal, setShowWinModal] = useState(false);
  const [isEndlessMode, setIsEndlessMode] = useState(false);
  const [endlessTargetBrawler, setEndlessTargetBrawler] = useState<Brawler | null>(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error" as "error" | "success" | "warning",
  });

  const brawlers: Brawler[] = brawlersData;
  const dailyTargetBrawler = getTargetBrawler();
  
  const targetBrawler = isEndlessMode ? (endlessTargetBrawler || dailyTargetBrawler) : dailyTargetBrawler;

  function getRandomBrawler(): Brawler {
    const randomIndex = Math.floor(Math.random() * brawlers.length);
    return brawlers[randomIndex];
  }

  function getReleaseYearComparison(guessedYear: number, targetYear: number): "correct" | "higher" | "lower" | "incorrect" {
    if (guessedYear === targetYear) return "correct";
    if (guessedYear > targetYear) return "higher";
    if (guessedYear < targetYear) return "lower";
    return "incorrect";
  }

  const toggleMode = () => {
    const newMode = !isEndlessMode;
    setIsEndlessMode(newMode);
    
    if (newMode) {
      setEndlessTargetBrawler(getRandomBrawler());
      setGuesses([]);
      setGameWon(false);
      setShowDefeatModal(false);
      setShowWinModal(false);
      setCurrentGuess("");
    } else {
      setEndlessTargetBrawler(null);
      setGuesses([]);
      setGameWon(false);
      setShowDefeatModal(false);
      setShowWinModal(false);
      setCurrentGuess("");
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
      }
    }
  };

  const startNewEndlessGame = () => {
    setEndlessTargetBrawler(getRandomBrawler());
    setGuesses([]);
    setGameWon(false);
    setShowDefeatModal(false);
    setShowWinModal(false);
    setCurrentGuess("");
  };

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
    if (isEndlessMode && !endlessTargetBrawler) {
      setEndlessTargetBrawler(getRandomBrawler());
    }
  }, [isEndlessMode, endlessTargetBrawler]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedDate = localStorage.getItem("brawldle-date");
    const currentDate = getCurrentDate();

    if (savedDate !== currentDate) {
      localStorage.setItem("brawldle-date", currentDate);
      localStorage.removeItem("brawldle-guesses");
      localStorage.removeItem("brawldle-won");
      return;
    }

    const savedGuesses = localStorage.getItem("brawldle-guesses");
    const savedGameWon = localStorage.getItem("brawldle-won");

    if (savedGuesses) {
      setGuesses(JSON.parse(savedGuesses));
    }

    if (savedGameWon === "true" && savedGuesses) {
      const guesses: GuessResult[] = JSON.parse(savedGuesses) as GuessResult[];
      const hasWon = guesses.some(
        (guess) => guess.brawler.name === targetBrawler.name
      );
      setGameWon(hasWon);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && guesses.length > 0) {
      if (!isEndlessMode) {
        localStorage.setItem("brawldle-guesses", JSON.stringify(guesses));
        localStorage.setItem("brawldle-won", gameWon.toString());
        localStorage.setItem("brawldle-date", getCurrentDate());
      }

      if (gameWon) {
        setShowWinModal(true);
      }

      if (!isEndlessMode && guesses.length >= 6 && !gameWon) {
        setShowDefeatModal(true);
      }
    }
  }, [guesses, gameWon, isEndlessMode]);

  const showToastMessage = (message: string, type: "error" | "success" | "warning") => {
    setToast({
      visible: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({...prev, visible: false}));
    }, 3000);
  };

  const trackBrawlerGuess = (brawlerName: string, isCorrect: boolean) => {
    if (typeof window !== "undefined") {
      posthog.capture('brawler_guess', {
        brawler_name: brawlerName,
        is_correct: isCorrect,
        guess_number: guesses.length + 1,
        target_brawler: targetBrawler.name
      });
    }
  };

  const handleGuess = () => {
    if (gameWon || (!isEndlessMode && guesses.length >= 6)) {
      let message = "Você já usou todas as tentativas!";
      if (gameWon) {
        message = isEndlessMode ? "Você já acertou!" : "Você já acertou o brawler do dia!";
      }
      showToastMessage(message, "warning");
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
        releaseYear: getReleaseYearComparison(guessedBrawler.releaseYear, targetBrawler.releaseYear),
      },
    };

    if (guessedBrawler.name === targetBrawler.name) {
      setGameWon(true);
      trackBrawlerGuess(guessedBrawler.name, true);
      
      if (isEndlessMode) {
        setTimeout(() => {
          showToastMessage("Parabéns! Quer tentar outro brawler?", "success");
        }, 1000);
      }
    } else {
      trackBrawlerGuess(guessedBrawler.name, false);
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
        releaseYear: getReleaseYearComparison(guessedBrawler.releaseYear, targetBrawler.releaseYear),
      },
    };

    if (guessedBrawler.name === targetBrawler.name) {
      setGameWon(true);
      trackBrawlerGuess(guessedBrawler.name, true);
    } else {
      trackBrawlerGuess(guessedBrawler.name, false);
    }

    setAnimatingIndex(guesses.length);
    setGuesses([...guesses, result]);
    setCurrentGuess("");

    setTimeout(() => setAnimatingIndex(null), 600);
  };

  return (
    <div className="min-h-screen custom-background text-white">
      {/* fundo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
        <Header 
          onShowRules={() => setShowRules(!showRules)}
          isEndlessMode={isEndlessMode}
          onToggleMode={toggleMode}
        />

        {/* Modal de regras */}
        <RulesModal
          visible={showRules}
          onClose={() => setShowRules(false)}
        />

        {/* Modal de resultado (vitória/derrota) */}
        <ResultModal
          visible={showWinModal}
          onClose={() => setShowWinModal(false)}
          brawler={targetBrawler}
          guessCount={guesses.length}
          isWin={true}
          isEndlessMode={isEndlessMode}
          onNewGame={startNewEndlessGame}
        />

        <ResultModal
          visible={showDefeatModal}
          onClose={() => setShowDefeatModal(false)}
          brawler={targetBrawler}
          guessCount={guesses.length}
          isWin={false}
          isEndlessMode={isEndlessMode}
        />

        {/* Input */}
        <GuessInput
          brawlers={brawlers}
          currentGuess={currentGuess}
          setCurrentGuess={setCurrentGuess}
          onGuess={handleGuess}
          onSelectBrawler={handleSelectBrawler}
          isDisabled={gameWon || (!isEndlessMode && guesses.length >= 6)}
          gameWon={gameWon}
          attemptsExhausted={!isEndlessMode && guesses.length >= 6 && !gameWon}
          isEndlessMode={isEndlessMode}
        />

        {/* Grid do jogo */}
        <BrawlerGuessGrid
          guesses={guesses}
          animatingIndex={animatingIndex}
        />

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  );
}
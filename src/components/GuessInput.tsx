import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface Brawler {
  name: string;
  rarity: string;
  role: string;
  gender: string;
  releaseYear: number;
  imageUrl: string;
}

interface GuessInputProps {
  readonly brawlers: Brawler[];
  readonly currentGuess: string;
  readonly setCurrentGuess: (guess: string) => void;
  readonly onGuess: () => void;
  readonly onSelectBrawler: (brawlerName: string) => void;
  readonly isDisabled: boolean;
  readonly gameWon: boolean;
  readonly attemptsExhausted: boolean;
  readonly isEndlessMode: boolean;
}

export function GuessInput({
                             brawlers,
                             currentGuess,
                             setCurrentGuess,
                             onGuess,
                             onSelectBrawler,
                             isDisabled,
                             gameWon,
                             attemptsExhausted,
                             isEndlessMode
                           }: GuessInputProps) {
  const [suggestions, setSuggestions] = useState<Brawler[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getPlaceholder = () => {
    if (gameWon) {
      return isEndlessMode ? "Parabéns! Você acertou!" : "Parabéns! Você acertou o Brawler do dia!";
    }
    if (attemptsExhausted && !isEndlessMode) {
      return "Game over! Tente novamente amanhã";
    }
    return "Digite o nome de um Brawler...";
  };

  useEffect(() => {
    if (currentGuess.length > 0) {
      const filteredSuggestions = brawlers
        .filter((brawler) =>
          brawler.name.toLowerCase().includes(currentGuess.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [currentGuess, brawlers]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isDisabled) {
      if (suggestions.length > 0) {
        const selectedBrawlerName = suggestions[0].name;

        setCurrentGuess(selectedBrawlerName);

        e.preventDefault();

        setTimeout(() => {
          const brawler = brawlers.find(
            (b) => b.name.toLowerCase() === selectedBrawlerName.toLowerCase()
          );

          if (brawler) {
            onSelectBrawler(selectedBrawlerName);
          }
        }, 50);
      } else if (currentGuess.trim()) {
        onGuess();
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const selectSuggestion = (brawlerName: string) => {
    setCurrentGuess(brawlerName);
    setShowSuggestions(false);
  };

  return (
    <div className="mb-8">
      <div className="max-w-xl mx-auto relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              className="w-full h-12 text-lg bg-white border-gray-300 text-black placeholder:text-gray-500 focus:bg-white focus:border-blue-500 transition-all duration-200"
              type="text"
              placeholder={getPlaceholder()}
              value={currentGuess}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() => currentGuess.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              disabled={isDisabled}
            />

            {/* sugestões */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute z-20 w-full mt-1 bg-white/95 backdrop-blur-sm border-white/20">
                <CardContent className="p-0">
                  {suggestions.map((brawler) => (
                    <button
                      key={brawler.name}
                      onClick={() => selectSuggestion(brawler.name)}
                      className="flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg w-full text-left"
                    >
                      <Image
                        src={brawler.imageUrl || "/placeholder.svg"}
                        alt={brawler.name}
                        width={32}
                        height={32}
                        className="rounded-full mr-3"
                      />
                      <span className="text-gray-800 font-medium">
                        {brawler.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs"
                      >
                        {brawler.rarity}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <Button
            onClick={onGuess}
            disabled={!currentGuess || isDisabled}
            className="h-12 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
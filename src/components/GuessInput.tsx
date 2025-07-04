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
  brawlers: Brawler[];
  currentGuess: string;
  setCurrentGuess: (value: string) => void;
  onGuess: () => void;
  onSelectBrawler: (brawlerName: string) => void; // Nova prop
  isDisabled: boolean;
}

export function GuessInput({
                             brawlers,
                             currentGuess,
                             setCurrentGuess,
                             onGuess,
                             onSelectBrawler,
                             isDisabled
                           }: GuessInputProps) {
  const [suggestions, setSuggestions] = useState<Brawler[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
              className="w-full h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all duration-200"
              type="text"
              placeholder="Digite o nome do Brawler..."
              value={currentGuess}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => currentGuess.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              disabled={isDisabled}
            />

            {/* sugestões */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute z-20 w-full mt-1 bg-white/95 backdrop-blur-sm border-white/20">
                <CardContent className="p-0">
                  {suggestions.map((brawler, i) => (
                    <div
                      key={i}
                      onClick={() => selectSuggestion(brawler.name)}
                      className="flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
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
                    </div>
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
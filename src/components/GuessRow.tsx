import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GuessRowProps {
  guess: {
    brawler: {
      name: string;
      rarity: string;
      role: string;
      gender: string;
      releaseYear: number;
      imageUrl: string;
    };
    correctness: {
      name: boolean;
      rarity: boolean;
      role: boolean;
      gender: boolean;
      releaseYear: "correct" | "higher" | "lower" | "incorrect";
    };
  };
  isAnimating: boolean;
}

export function GuessRow({ guess, isAnimating }: GuessRowProps) {
  return (
    <div
      className={`grid grid-cols-5 gap-2 transition-all duration-600 ${
        isAnimating ? "animate-pulse scale-105" : ""
      }`}
    >
      {/* Brawler */}
      <Card
        className={`${
          guess.correctness.name ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105`}
      >
        <CardContent className="flex items-center justify-center p-3 gap-2">
          <Image
            src={guess.brawler.imageUrl || "/placeholder.svg"}
            alt={guess.brawler.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xs font-medium text-white truncate">
            {guess.brawler.name}
          </span>
        </CardContent>
      </Card>

      {/* raridade */}
      <Card
        className={`${
          guess.correctness.rarity ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105`}
      >
        <CardContent className="flex items-center justify-center p-3">
          <span className="text-xs font-medium text-white text-center">
            {guess.brawler.rarity}
          </span>
        </CardContent>
      </Card>

      {/* função */}
      <Card
        className={`${
          guess.correctness.role ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105`}
      >
        <CardContent className="flex items-center justify-center p-3">
          <span className="text-xs font-medium text-white text-center">
            {guess.brawler.role}
          </span>
        </CardContent>
      </Card>

      {/* gênero */}
      <Card
        className={`${
          guess.correctness.gender ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105`}
      >
        <CardContent className="flex items-center justify-center p-3">
          <span className="text-xs font-medium text-white text-center">
            {guess.brawler.gender}
          </span>
        </CardContent>
      </Card>

      {/* Ano */}
      <Card
        className={`${
          guess.correctness.releaseYear === "correct"
            ? "bg-green-500"
            : guess.correctness.releaseYear === "higher" ||
            guess.correctness.releaseYear === "lower"
              ? "bg-yellow-500"
              : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105`}
      >
        <CardContent className="flex items-center justify-center p-3 gap-1">
          <span
            className={`text-xs font-medium ${
              guess.correctness.releaseYear === "higher" ||
              guess.correctness.releaseYear === "lower"
                ? "text-black"
                : "text-white"
            }`}
          >
            {guess.brawler.releaseYear}
          </span>
          {guess.correctness.releaseYear === "higher" && (
            <ChevronDown className="h-3 w-3 text-black" />
          )}
          {guess.correctness.releaseYear === "lower" && (
            <ChevronUp className="h-3 w-3 text-black" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
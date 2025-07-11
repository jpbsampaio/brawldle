import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const getReleaseYearClass = (releaseYear: string) => {
  if (releaseYear === "correct") return "bg-green-500";
  if (["higher", "lower"].includes(releaseYear)) return "bg-yellow-500";
  return "bg-gray-600";
};

interface GuessRowProps {
  readonly guess: {
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
  readonly isAnimating: boolean;
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
        } border-0 transition-all duration-300 hover:scale-105 h-40 min-w-0`}
      >
        <CardContent className="flex items-center justify-center p-2 gap-2 h-full w-full">
          <Image
            src={guess.brawler.imageUrl || "/placeholder.svg"}
            alt={guess.brawler.name}
            width={28}
            height={28}
            className="rounded-full flex-shrink-0"
          />
          <span className="font-medium text-white truncate min-w-0 guess-row-text">
            {guess.brawler.name}
          </span>
        </CardContent>
      </Card>

      {/* raridade */}
      <Card
        className={`${
          guess.correctness.rarity ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105 h-40 w-full`}
      >
        <CardContent className="flex items-center justify-center p-2 h-full w-full">
          <span className="font-medium text-white text-center break-words guess-row-text">
            {guess.brawler.rarity}
          </span>
        </CardContent>
      </Card>

      {/* função */}
      <Card
        className={`${
          guess.correctness.role ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105 h-40 w-full`}
      >
        <CardContent className="flex items-center justify-center p-2 h-full w-full">
          <span className="font-medium text-white text-center break-words guess-row-text">
            {guess.brawler.role}
          </span>
        </CardContent>
      </Card>

      {/* gênero */}
      <Card
        className={`${
          guess.correctness.gender ? "bg-green-500" : "bg-gray-600"
        } border-0 transition-all duration-300 hover:scale-105 h-40 w-full`}
      >
        <CardContent className="flex items-center justify-center p-2 h-full w-full">
          <span className="font-medium text-white text-center break-words guess-row-text">
            {guess.brawler.gender}
          </span>
        </CardContent>
      </Card>

      {/* Ano */}
      <Card
        className={`${getReleaseYearClass(guess.correctness.releaseYear)} border-0 transition-all duration-300 hover:scale-105 h-40 w-full relative`}
      >
        <CardContent className="flex items-center justify-center p-2 gap-1 h-full w-full">
          <span
            className={`font-medium guess-row-text ${
              guess.correctness.releaseYear === "higher" ||
              guess.correctness.releaseYear === "lower"
                ? "text-black"
                : "text-white"
            }`}
          >
            {guess.brawler.releaseYear}
          </span>
          {guess.correctness.releaseYear === "higher" && (
            <Image
              src="/DateArrow.png"
              alt="Arrow pointing down"
              width={60}
              height={60}
              className="flex-shrink-0 transform rotate-180 absolute right-2"
            />
          )}
          {guess.correctness.releaseYear === "lower" && (
            <Image
              src="/DateArrow.png"
              alt="Arrow pointing up"
              width={60}
              height={60}
              className="flex-shrink-0 absolute right-2"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
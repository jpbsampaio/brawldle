import { Card, CardContent } from "./ui/card";
import { GuessRow } from "./GuessRow";

interface GuessResult {
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
}

interface BrawlerGuessGridProps {
  guesses: GuessResult[];
  animatingIndex: number | null;
}

export function BrawlerGuessGrid({ guesses, animatingIndex }: BrawlerGuessGridProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Headers */}
      <div className="grid grid-cols-5 gap-2 mb-4 text-center font-bold text-sm text-white/80">
        <div>Brawler</div>
        <div>Raridade</div>
        <div>Função</div>
        <div>Gênero</div>
        <div>Ano</div>
      </div>

      {/* tentativas */}
      <div className="space-y-2">
        {guesses.toReversed().map((guess, index) => (
          <GuessRow
            key={index}
            guess={guess}
            isAnimating={animatingIndex === index}
          />
        ))}

        {/* linhas vazias */}
        {Array.from({ length: 6 - guesses.length }).map((_, index) => (
          <div key={`empty-${index}`} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, cellIndex) => (
              <Card
                key={`empty-cell-${cellIndex}`}
                className="bg-white/5 border-white/10"
              >
                <CardContent className="p-3 h-16"></CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Trophy, Share2 } from "lucide-react";

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  brawler: {
    name: string;
    imageUrl: string;
  };
  guessCount: number;
  isWin: boolean;
}

export function ResultModal({ visible, onClose, brawler, guessCount, isWin }: ResultModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className={`w-full max-w-md ${
        isWin
          ? "bg-gradient-to-r from-green-600/80 to-emerald-600/80 border-green-400/30"
          : "bg-gradient-to-r from-red-600/80 to-rose-600/80 border-red-400/30"
      }`}>
        <CardContent className="text-center py-8 px-4">
          <div className="flex justify-center mb-4">
            {isWin ? (
              <Trophy className="h-16 w-16 text-yellow-400 animate-bounce" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   className="text-red-400 animate-pulse">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isWin ? "text-green-400" : "text-red-400"}`}>
            {isWin ? "Parabéns!" : "Não foi dessa vez!"}
          </h2>
          <p className="text-lg mb-4">
            {isWin
              ? `Você acertou em ${guessCount} tentativa${guessCount !== 1 ? "s" : ""}!`
              : "Você usou todas as tentativas."}
          </p>
          <div className="my-6">
            <Image
              src={brawler.imageUrl || "/placeholder.svg"}
              alt={brawler.name}
              width={120}
              height={120}
              className={`mx-auto rounded-full border-4 ${
                isWin ? "border-yellow-400" : "border-red-400"
              } shadow-lg`}
            />
            <p className="mt-2 text-xl font-bold text-yellow-400">
              {brawler.name}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-bold"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-black hover:bg-white/20"
              onClick={onClose}
            >
              Continuar Jogando
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
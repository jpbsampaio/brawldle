import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Trophy, Share2 } from "lucide-react";
import { useState } from "react";
import { Toast } from "./Toast";

interface ResultModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly brawler: {
    name: string;
    imageUrl: string;
  };
  readonly guessCount: number;
  readonly isWin: boolean;
  readonly isEndlessMode?: boolean;
  readonly onNewGame?: () => void;
}

export function ResultModal({ visible, onClose, brawler, guessCount, isWin, isEndlessMode, onNewGame }: ResultModalProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning">("success");

  if (!visible) return null;

  const generateShareText = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    let emoji = isWin ? "✅" : "❌";
    let guessEmojis = "";

    for (let i = 1; i < guessCount; i++) {
      guessEmojis += "🟨";
    }

    if (guessCount > 0) {
      guessEmojis += isWin ? "🟩" : "🟥";
    }

    const tentativaText = guessCount !== 1 ? "s" : "";
    const resultText = isWin
      ? `acertei em ${guessCount} tentativa${tentativaText}`
      : "não acertei o brawler hoje";

    return `Brawldle ${today} ${emoji}\n\n${guessEmojis}\n\nEu ${resultText}!\n\njogue em: brawldle.vercel.app`;
  };

  const handleShare = () => {
    const shareText = generateShareText();

    navigator.clipboard.writeText(shareText)
      .then(() => {
        setToastMessage("Resultado copiado para a área de transferência");
        setToastType("success");
        setToastVisible(true);

        setTimeout(() => {
          setToastVisible(false);
        }, 3000);
      })
      .catch(err => {
        setToastMessage("Não foi possível copiar o resultado");
        setToastType("error");
        setToastVisible(true);

        setTimeout(() => {
          setToastVisible(false);
        }, 3000);

        console.error("Erro ao copiar para área de transferência:", err);
      });
  };

  return (
    <>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40">
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
                ? (() => {
                    const tentativas = guessCount !== 1 ? "s" : "";
                    return `Você acertou em ${guessCount} tentativa${tentativas}!`;
                  })()
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
              {isEndlessMode && isWin && onNewGame && (
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold"
                  onClick={() => {
                    onNewGame();
                    onClose();
                  }}
                >
                  Novo Jogo
                </Button>
              )}
              <Button
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-bold"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-black hover:bg-white/20"
                onClick={onClose}
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { HelpCircle, Infinity } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  readonly onShowRules: () => void;
  readonly isEndlessMode: boolean;
  readonly onToggleMode: () => void;
}

export function Header({ onShowRules, isEndlessMode, onToggleMode }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8 pb-6 border-b border-white/20">
      <Button
        onClick={onShowRules}
        variant="outline"
        size="icon"
        className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 border-0 shadow-lg hover:scale-105 transition-all duration-200"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-black brawldle-title tracking-wide">
          BRAWL<span className="red-part">DLE</span>
        </h1>
        <div className="flex justify-center mt-2 mb-1">
          <Image
            src="/brawl-stars-logo.png"
            alt="Brawl Stars Logo"
            width={60}
            height={60}
            className="brawl-logo"
          />
        </div>
        <p className="text-sm text-white/70 mt-1">
          {isEndlessMode ? "Modo Endless - Tentativas ilimitadas!" : "Adivinhe o Brawler do dia!"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleMode}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 transition-all duration-200"
        >
          <Infinity className="h-4 w-4 mr-2" />
          {isEndlessMode ? "Diário" : "Endless"}
        </Button>
        
        {!isEndlessMode && (
          <Badge
            variant="secondary"
            className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
          >
            #{new Date().getDate()}
          </Badge>
        )}
      </div>
    </header>
  );
}
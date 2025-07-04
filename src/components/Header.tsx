import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { HelpCircle } from "lucide-react";

interface HeaderProps {
  onShowRules: () => void;
}

export function Header({ onShowRules }: HeaderProps) {
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
        <h1
          className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-wide">
          BRAWL<span className="text-red-400">DLE</span>
        </h1>
        <p className="text-sm text-white/70 mt-1">
          Adivinhe o Brawler do dia!
        </p>
      </div>

      <Badge
        variant="secondary"
        className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
      >
        #{new Date().getDate()}
      </Badge>
    </header>
  );
}
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function RulesModal({ visible, onClose }: RulesModalProps) {
  if (!visible) return null;

  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-800/50 to-purple-800/50 border-white/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-yellow-400">
            Como jogar
          </h2>
        </div>
        <ul className="space-y-3 text-sm text-white/90">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            Adivinhe o brawler secreto do dia em até 6 tentativas
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            Cada palpite deve ser um brawler válido
          </li>
          <li className="flex items-center gap-3">
            <Badge className="bg-green-500 hover:bg-green-500">
              Verde
            </Badge>
            <span>= Atributo correto</span>
          </li>
          <li className="flex items-center gap-3">
            <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">
              Amarelo
            </Badge>
            <span>= Ano maior/menor que o correto</span>
          </li>
          <li className="flex items-center gap-3">
            <Badge variant="secondary">Cinza</Badge>
            <span>= Atributo incorreto</span>
          </li>
        </ul>
        <Button
          onClick={onClose}
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold"
        >
          Entendi!
        </Button>
      </CardContent>
    </Card>
  );
}
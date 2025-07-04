// TODO: Melhorar a UI
// TODO: Persistência de dados (localStorage)
// TODO: compartilhamento do resultado com emojis
// TODO: Animações com framer-motion
// TODO: ranking de acertos semanais

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown, Trophy, Share2, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import brawlersData from "../data/brawlers.json"

interface Brawler {
  name: string
  rarity: string
  role: string
  gender: string
  releaseYear: number
  imageUrl: string
}

interface GuessResult {
  brawler: Brawler
  correctness: {
    name: boolean
    rarity: boolean
    role: boolean
    gender: boolean
    releaseYear: "correct" | "higher" | "lower" | "incorrect"
  }
}

const rarityColors = {
  Common: "bg-gray-500",
  Rare: "bg-green-500",
  "Super Rare": "bg-blue-500",
  Epic: "bg-purple-500",
  Mythic: "bg-pink-500",
  Legendary: "bg-yellow-500",
  Chromatic: "bg-gradient-to-r from-purple-500 to-pink-500",
}

export default function Home() {
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameWon, setGameWon] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [suggestions, setSuggestions] = useState<Brawler[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)

  const brawlers: Brawler[] = brawlersData

  const getTargetBrawler = (): Brawler => {
    const today = new Date()
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    let seed = 0
    for (let i = 0; i < dateString.length; i++) {
      seed = (seed << 5) - seed + dateString.charCodeAt(i)
      seed = seed & seed
    }
    const index = Math.abs(seed) % brawlers.length
    return brawlers[index]
  }

  const targetBrawler = getTargetBrawler()

  useEffect(() => {
    if (currentGuess.length > 0) {
      const filtered = brawlers
        .filter((brawler) => brawler.name.toLowerCase().includes(currentGuess.toLowerCase()))
        .slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [currentGuess, brawlers])

  const handleGuess = () => {
    const guessedBrawler = brawlers.find((b) => b.name.toLowerCase() === currentGuess.toLowerCase())
    if (!guessedBrawler) {
      alert("Brawler não encontrado!")
      return
    }

    const result: GuessResult = {
      brawler: guessedBrawler,
      correctness: {
        name: guessedBrawler.name === targetBrawler.name,
        rarity: guessedBrawler.rarity === targetBrawler.rarity,
        role: guessedBrawler.role === targetBrawler.role,
        gender: guessedBrawler.gender === targetBrawler.gender,
        releaseYear:
          guessedBrawler.releaseYear === targetBrawler.releaseYear
            ? "correct"
            : guessedBrawler.releaseYear > targetBrawler.releaseYear
              ? "higher"
              : "lower",
      },
    }

    if (guessedBrawler.name === targetBrawler.name) {
      setGameWon(true)
    }

    setAnimatingIndex(guesses.length)
    setGuesses([...guesses, result])
    setCurrentGuess("")

    setTimeout(() => setAnimatingIndex(null), 600)
  }

  const selectSuggestion = (brawlerName: string) => {
    setCurrentGuess(brawlerName)
    setShowSuggestions(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentGuess && !gameWon) {
      handleGuess()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-white/20">
          <Button
            onClick={() => setShowRules(!showRules)}
            variant="outline"
            size="icon"
            className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 border-0 shadow-lg hover:scale-105 transition-all duration-200"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-wide">
              BRAWL<span className="text-red-400">DLE</span>
            </h1>
            <p className="text-sm text-white/70 mt-1">Adivinhe o Brawler do dia!</p>
          </div>

          <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
            #{new Date().getDate()}
          </Badge>
        </header>

        {/* Modal de regras */}
        {showRules && (
          <Card className="mb-8 bg-gradient-to-r from-blue-800/50 to-purple-800/50 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-yellow-400">Como jogar</h2>
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
                  <Badge className="bg-green-500 hover:bg-green-500">Verde</Badge>
                  <span>= Atributo correto</span>
                </li>
                <li className="flex items-center gap-3">
                  <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">Amarelo</Badge>
                  <span>= Ano maior/menor que o correto</span>
                </li>
                <li className="flex items-center gap-3">
                  <Badge variant="secondary">Cinza</Badge>
                  <span>= Atributo incorreto</span>
                </li>
              </ul>
              <Button
                onClick={() => setShowRules(false)}
                className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold"
              >
                Entendi!
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tela de vitória */}
        {gameWon && (
          <Card className="mb-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/30 backdrop-blur-sm">
            <CardContent className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-yellow-400 animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-green-400">Parabéns!</h2>
              <p className="text-lg mb-4">
                Você acertou em {guesses.length} tentativa{guesses.length !== 1 ? "s" : ""}!
              </p>
              <div className="my-6">
                <Image
                  src={targetBrawler.imageUrl || "/placeholder.svg"}
                  alt={targetBrawler.name}
                  width={120}
                  height={120}
                  className="mx-auto rounded-full border-4 border-yellow-400 shadow-lg"
                />
                <p className="mt-2 text-xl font-bold text-yellow-400">{targetBrawler.name}</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-bold">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar Resultado
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Input */}
        {!gameWon && (
          <div className="mb-8">
            <div className="max-w-xl mx-auto relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    className="w-full h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all duration-200"
                    type="text"
                    placeholder="Digite o nome do Brawler..."
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => currentGuess.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />

                  {/* sugestão */}
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
                            <span className="text-gray-800 font-medium">{brawler.name}</span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              {brawler.rarity}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Button
                  onClick={handleGuess}
                  disabled={!currentGuess || gameWon}
                  className="h-12 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* grid do jogo */}
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
            {guesses.map((guess, index) => (
              <div
                key={index}
                className={`grid grid-cols-5 gap-2 transition-all duration-600 ${
                  animatingIndex === index ? "animate-pulse scale-105" : ""
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
                    <span className="text-xs font-medium text-white truncate">{guess.brawler.name}</span>
                  </CardContent>
                </Card>

                {/* raridade */}
                <Card
                  className={`${
                    guess.correctness.rarity ? "bg-green-500" : "bg-gray-600"
                  } border-0 transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="flex items-center justify-center p-3">
                    <span className="text-xs font-medium text-white text-center">{guess.brawler.rarity}</span>
                  </CardContent>
                </Card>

                {/* função */}
                <Card
                  className={`${
                    guess.correctness.role ? "bg-green-500" : "bg-gray-600"
                  } border-0 transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="flex items-center justify-center p-3">
                    <span className="text-xs font-medium text-white text-center">{guess.brawler.role}</span>
                  </CardContent>
                </Card>

                {/* gênero */}
                <Card
                  className={`${
                    guess.correctness.gender ? "bg-green-500" : "bg-gray-600"
                  } border-0 transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="flex items-center justify-center p-3">
                    <span className="text-xs font-medium text-white text-center">{guess.brawler.gender}</span>
                  </CardContent>
                </Card>

                {/* Ano */}
                <Card
                  className={`${
                    guess.correctness.releaseYear === "correct"
                      ? "bg-green-500"
                      : guess.correctness.releaseYear === "higher" || guess.correctness.releaseYear === "lower"
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                  } border-0 transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="flex items-center justify-center p-3 gap-1">
                    <span
                      className={`text-xs font-medium ${
                        guess.correctness.releaseYear === "higher" || guess.correctness.releaseYear === "lower"
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      {guess.brawler.releaseYear}
                    </span>
                    {guess.correctness.releaseYear === "higher" && <ChevronDown className="h-3 w-3 text-black" />}
                    {guess.correctness.releaseYear === "lower" && <ChevronUp className="h-3 w-3 text-black" />}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* linha vazia */}
            {Array.from({ length: 6 - guesses.length }).map((_, index) => (
              <div key={`empty-${index}`} className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <Card key={`empty-cell-${cellIndex}`} className="bg-white/5 border-white/10">
                    <CardContent className="p-3 h-16"></CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 text-center text-sm text-white/60 border-t border-white/10">
          <p className="mb-2">🎮 Um novo Brawldle estará disponível amanhã!</p>
          <p>© 2024 BrawlDle - Não oficial, feito por fãs de Brawl Stars</p>
        </footer>
      </div>
    </div>
  )
}

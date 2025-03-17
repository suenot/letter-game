"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Menu, X, Settings, Eye, EyeOff } from "lucide-react"

// Функция для правильного склонения слов
function pluralizeRussian(count: number, one: string, few: string, many: string): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${one}`
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} ${few}`
  } else {
    return `${count} ${many}`
  }
}

// Наборы слов (уровни) с темами и реальными изображениями
const wordSets = [
  {
    id: 1,
    title: "Животные",
    words: [
      {
        word: "кошка",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
        hint: "Животное",
      },
      {
        word: "слон",
        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=200&h=200&fit=crop",
        hint: "Большое животное",
      },
      {
        word: "рыбка",
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&h=200&fit=crop",
        hint: "Плавает в воде",
      },
    ],
    reward: "🦁",
  },
  {
    id: 2,
    title: "Фрукты",
    words: [
      {
        word: "яблоко",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
        hint: "Красный фрукт",
      },
      {
        word: "банан",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop",
        hint: "Жёлтый фрукт",
      },
      {
        word: "груша",
        image: "https://images.unsplash.com/photo-1607522370275-1421e326fae2?w=200&h=200&fit=crop",
        hint: "Сладкий фрукт",
      },
    ],
    reward: "🍎",
  },
  {
    id: 3,
    title: "Игрушки",
    words: [
      {
        word: "мишка",
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop",
        hint: "Мягкая игрушка",
      },
      {
        word: "мяч",
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&h=200&fit=crop",
        hint: "Круглая игрушка",
      },
      {
        word: "кукла",
        image: "https://images.unsplash.com/photo-1589874186480-ecd5076c0b8f?w=200&h=200&fit=crop",
        hint: "Игрушка для девочек",
      },
    ],
    reward: "🧸",
  },
  {
    id: 4,
    title: "Еда",
    words: [
      {
        word: "суп",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop",
        hint: "Жидкое блюдо",
      },
      {
        word: "торт",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop",
        hint: "Сладкое на праздник",
      },
      {
        word: "хлеб",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
        hint: "Выпечка",
      },
    ],
    reward: "🍰",
  },
  {
    id: 5,
    title: "Дом",
    words: [
      {
        word: "стол",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
        hint: "Мебель",
      },
      {
        word: "окно",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200&h=200&fit=crop",
        hint: "Через него смотрим на улицу",
      },
      {
        word: "дверь",
        image: "https://images.unsplash.com/photo-1595526114035-0d45a16a0f05?w=200&h=200&fit=crop",
        hint: "Через неё входим в дом",
      },
    ],
    reward: "🏠",
  },
]

// Звуки для успеха
const successSounds = [
  "ура!",
  "молодец!",
  "супер!",
  "отлично!",
  "класс!",
  "здорово!",
  "вау!",
  "ты умница!",
  "браво!",
  "так держать!",
]

export default function LetterGame() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [missingLetterIndex, setMissingLetterIndex] = useState(0)
  const [letters, setLetters] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [filledLetter, setFilledLetter] = useState<string | null>(null)
  const [collectedRewards, setCollectedRewards] = useState<string[]>([])
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [showBalloon, setShowBalloon] = useState(false)
  const [currentSound, setCurrentSound] = useState("")
  const [showTreasureChest, setShowTreasureChest] = useState(false)
  const [chestOpened, setChestOpened] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showSettingsTab, setShowSettingsTab] = useState(false)
  const [showImageAtStart, setShowImageAtStart] = useState(true)
  const gapRef = useRef<HTMLDivElement>(null)

  // Получаем текущий набор слов и слово
  const currentSet = wordSets[currentSetIndex]
  const currentWordSet = currentSet.words
  const currentWord = currentWordSet[currentWordIndex].word

  // Вычисляем прогресс в текущем наборе
  const progress = (currentWordIndex / currentWordSet.length) * 100

  // Подготовка игры
  useEffect(() => {
    prepareGame()
  }, [currentSetIndex, currentWordIndex])

  const prepareGame = () => {
    const word = currentWord
    // Выбираем случайную позицию для пропущенной буквы
    const randomIndex = Math.floor(Math.random() * word.length)
    setMissingLetterIndex(randomIndex)

    // Создаем набор букв для выбора (правильная + случайные)
    const correctLetter = word[randomIndex]
    const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
    const randomLetters = []

    // Добавляем 3 случайные буквы
    while (randomLetters.length < 3) {
      const randLetter = alphabet[Math.floor(Math.random() * alphabet.length)]
      if (randLetter !== correctLetter && !randomLetters.includes(randLetter)) {
        randomLetters.push(randLetter)
      }
    }

    // Добавляем правильную букву и перемешиваем
    randomLetters.push(correctLetter)
    setLetters(randomLetters.sort(() => Math.random() - 0.5))
    setIsCorrect(null)
    setSelectedLetter(null)
    setFilledLetter(null)
    setShowBalloon(false)
    setCurrentSound("")
  }

  const handleLetterClick = (letter: string) => {
    if (isCorrect !== null || selectedLetter !== null) return

    setSelectedLetter(letter)
    setFilledLetter(letter)

    // Проверяем правильность ответа
    const correctLetter = currentWord[missingLetterIndex]

    if (letter === correctLetter) {
      setIsCorrect(true)

      // Показываем воздушный шарик
      setShowBalloon(true)

      // Выбираем случайный звук успеха
      setCurrentSound(successSounds[Math.floor(Math.random() * successSounds.length)])

      // Запускаем конфетти при правильном ответе
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Проверяем, закончился ли набор слов
      const isLastWordInSet = currentWordIndex === currentWordSet.length - 1

      if (isLastWordInSet) {
        // Показываем сундук с наградой за набор
        setTimeout(() => {
          setShowTreasureChest(true)
          setChestOpened(false)
        }, 1000)
      } else {
        // Переходим к следующему слову через 1.5 секунды
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1)
        }, 1500)
      }
    } else {
      setIsCorrect(false)

      // Сбрасываем через 1 секунду
      setTimeout(() => {
        setIsCorrect(null)
        setSelectedLetter(null)
        setFilledLetter(null)
      }, 1000)
    }
  }

  const handleDrop = (e: React.DragEvent, targetLetter: string) => {
    e.preventDefault()
    const letter = e.dataTransfer.getData("letter")

    if (letter) {
      handleLetterClick(letter)
    }
  }

  const handleDragStart = (e: React.DragEvent, letter: string) => {
    e.dataTransfer.setData("letter", letter)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleOpenChest = () => {
    setChestOpened(true)

    // Запускаем много конфетти
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#FF4500", "#FF1493", "#9400D3"],
    })

    // Добавляем награду за набор
    setCollectedRewards((prev) => [...prev, currentSet.reward])

    // Отмечаем набор как пройденный
    setCompletedSets((prev) => {
      if (!prev.includes(currentSet.id)) {
        return [...prev, currentSet.id]
      }
      return prev
    })

    // Закрываем сундук и переходим к следующему набору через 2 секунды
    setTimeout(() => {
      setShowTreasureChest(false)

      // Переходим к следующему набору или начинаем сначала
      if (currentSetIndex < wordSets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1)
      } else {
        setCurrentSetIndex(0)
      }

      setCurrentWordIndex(0)
    }, 2000)
  }

  const selectWordSet = (index: number) => {
    if (showTreasureChest) return // Не меняем набор, если открыт сундук

    setCurrentSetIndex(index)
    setCurrentWordIndex(0)
    setDrawerOpen(false)
  }

  const toggleImageSetting = () => {
    setShowImageAtStart(!showImageAtStart)
  }

  // Определяем, нужно ли показывать изображение
  const shouldShowImage = showImageAtStart || isCorrect === true

  // Вычисляем, сколько слов осталось в наборе
  const wordsLeftInSet = currentWordSet.length - currentWordIndex

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4 overflow-hidden">
      {/* Кнопка открытия боковой панели */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 right-4 z-30 bg-purple-500 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        aria-label="Открыть меню"
      >
        <Menu size={24} />
      </button>

      {/* Боковая панель */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Панель */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 p-4 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <h2 className={`text-xl font-bold ${showSettingsTab ? "text-gray-400" : "text-purple-700"}`}>Темы</h2>
                  <button
                    onClick={() => setShowSettingsTab(false)}
                    className={`ml-2 ${!showSettingsTab ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"} rounded-md px-2 py-1 text-xs`}
                  >
                    Темы
                  </button>
                  <button
                    onClick={() => setShowSettingsTab(true)}
                    className={`ml-1 ${showSettingsTab ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"} rounded-md px-2 py-1 text-xs flex items-center`}
                  >
                    <Settings size={12} className="mr-1" />
                    Настройки
                  </button>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Закрыть меню"
                >
                  <X size={24} />
                </button>
              </div>

              {!showSettingsTab ? (
                // Вкладка с темами
                <div className="space-y-3">
                  {wordSets.map((set, index) => (
                    <motion.div
                      key={set.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectWordSet(index)}
                      className={`
                        p-3 rounded-xl cursor-pointer transition-colors
                        ${
                          completedSets.includes(set.id)
                            ? "bg-green-100 border-2 border-green-300"
                            : "bg-gray-100 hover:bg-gray-200"
                        }
                        ${currentSetIndex === index ? "border-2 border-purple-400" : ""}
                      `}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{set.reward}</span>
                        <div>
                          <h3 className="font-bold">{set.title}</h3>
                          <p className="text-sm text-gray-600">
                            {pluralizeRussian(set.words.length, "слово", "слова", "слов")}
                          </p>
                        </div>
                        {completedSets.includes(set.id) && <span className="ml-auto text-green-500 text-xl">✓</span>}
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-purple-700 mb-2">Твои награды:</h3>
                    <div className="flex flex-wrap gap-2">
                      {collectedRewards.map((reward, index) => (
                        <div key={index} className="text-2xl">
                          {reward}
                        </div>
                      ))}
                      {collectedRewards.length === 0 && (
                        <p className="text-sm text-gray-500">Пройди уровень, чтобы получить награду!</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Вкладка с настройками
                <div className="space-y-4">
                  <h3 className="font-bold text-purple-700 mb-3">Настройки игры</h3>

                  <div className="bg-gray-100 p-3 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Показывать картинку</h4>
                        <p className="text-sm text-gray-600">
                          {showImageAtStart ? "Картинка видна сразу" : "Картинка появится после правильного ответа"}
                        </p>
                      </div>
                      <button
                        onClick={toggleImageSetting}
                        className={`p-2 rounded-full ${showImageAtStart ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}
                      >
                        {showImageAtStart ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>Версия игры: 1.0</p>
                    <p className="mt-1">Разработано для Макса 🚀</p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4 text-center">
        Привет, Макс! Давай найдем букву!
      </h1>

      {/* Коллекция наград */}
      <div className="flex flex-wrap justify-center gap-3 mb-4 max-w-md">
        {collectedRewards.map((reward, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.1 * (collectedRewards.length - index - 1) }}
            className="text-4xl"
          >
            {reward}
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md relative">
        {/* Воздушный шарик с поздравлением */}
        <AnimatePresence>
          {showBalloon && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: -100, opacity: 1 }}
              exit={{ y: -200, opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
            >
              <div className="relative">
                <div className="text-6xl">🎈</div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-3 py-1 rounded-xl text-sm font-bold whitespace-nowrap">
                  {currentSound}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Название текущей темы */}
        <div className="absolute top-2 left-2">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
            {currentSet.title}
          </span>
        </div>

        <div className="flex justify-center mb-4 mt-4">
          {shouldShowImage ? (
            <Image
              src={currentWordSet[currentWordIndex].image || "/placeholder.svg"}
              alt={currentWord}
              width={200}
              height={200}
              className="rounded-xl"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-200 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="text-7xl text-red-500"
              >
                ❓
              </motion.div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 mb-4">{currentWordSet[currentWordIndex].hint}</p>

        <div className="flex justify-center mb-8">
          {currentWord.split("").map((letter, index) => (
            <div
              key={index}
              className={`
                w-16 h-16 mx-1 flex items-center justify-center text-3xl font-bold 
                ${
                  index === missingLetterIndex
                    ? "border-4 border-dashed border-blue-400 rounded-lg"
                    : "bg-blue-100 rounded-lg"
                }
              `}
              ref={index === missingLetterIndex ? gapRef : null}
              onDrop={index === missingLetterIndex ? (e) => handleDrop(e, letter) : undefined}
              onDragOver={index === missingLetterIndex ? handleDragOver : undefined}
            >
              {index !== missingLetterIndex ? (
                letter
              ) : (
                <motion.div
                  initial={filledLetter ? { scale: 0 } : false}
                  animate={filledLetter ? { scale: 1 } : false}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    ${isCorrect === true ? "text-green-600" : ""}
                    ${isCorrect === false ? "text-red-600" : ""}
                  `}
                >
                  {filledLetter}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              draggable={selectedLetter !== letter}
              onDragStart={(e) => handleDragStart(e, letter)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLetterClick(letter)}
              className={`
                w-16 h-16 bg-yellow-400 rounded-xl text-3xl font-bold shadow-md 
                hover:bg-yellow-300 transition-colors flex items-center justify-center
                cursor-pointer select-none
                ${selectedLetter === letter ? "opacity-0" : "opacity-100"}
              `}
            >
              {letter}
            </motion.div>
          ))}
        </div>

        {isCorrect !== null && (
          <div className={`text-center text-xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
            {isCorrect ? "Правильно! Молодец! 🎉" : "Попробуй еще раз! 🙂"}
          </div>
        )}
      </div>

      {/* Сундук с сокровищами */}
      <AnimatePresence>
        {showTreasureChest && (
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={chestOpened ? undefined : handleOpenChest}
          >
            <motion.div
              className="bg-gradient-to-b from-yellow-200 to-yellow-400 p-8 rounded-3xl flex flex-col items-center"
              whileHover={chestOpened ? {} : { scale: 1.05 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                {chestOpened ? "Вот твоя награда!" : "Нажми на сундук!"}
              </h2>
              <motion.div
                className="text-8xl cursor-pointer"
                animate={chestOpened ? { rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.2, 1] } : {}}
              >
                {chestOpened ? currentSet.reward : "🎁"}
              </motion.div>
              {chestOpened && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xl font-bold text-purple-800"
                >
                  Супер! Ты прошёл тему "{currentSet.title}"!
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Прогресс */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-64 h-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
            initial={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-3 flex flex-col items-center">
          <div className="text-lg font-medium text-purple-700 mb-2">
            Осталось: {pluralizeRussian(wordsLeftInSet, "слово", "слова", "слов")}
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: wordsLeftInSet }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="w-10 h-10 bg-white border-2 border-purple-300 rounded-lg flex items-center justify-center shadow-md"
              >
                <span className="text-xl">🔮</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


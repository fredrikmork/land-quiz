import { Link } from "react-router-dom"
import { Globe, BookOpen } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import { getUserStatistics } from "../lib/quizApi"
import {
  getCountriesByContinent,
  countries,
  type Continent,
} from "../data/countries"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const continents: { name: Continent; gradient: string; glowColor: string }[] = [
  {
    name: "Europa",
    gradient: "var(--gradient-card-1)",
    glowColor: "var(--glow-card-1)",
  },
  {
    name: "Asia",
    gradient: "var(--gradient-card-2)",
    glowColor: "var(--glow-card-2)",
  },
  {
    name: "Afrika",
    gradient: "var(--gradient-card-3)",
    glowColor: "var(--glow-card-3)",
  },
  {
    name: "Nord-Amerika",
    gradient: "var(--gradient-card-4)",
    glowColor: "var(--glow-card-4)",
  },
  {
    name: "Sør-Amerika",
    gradient: "var(--gradient-card-1)",
    glowColor: "var(--glow-card-1)",
  },
  {
    name: "Oseania",
    gradient: "var(--gradient-card-2)",
    glowColor: "var(--glow-card-2)",
  },
]

const continentIcons: Record<Continent, string> = {
  Europa: "/europa-white.svg",
  Asia: "/asia-white.svg",
  Afrika: "/africa-white.svg",
  "Nord-Amerika": "/north-america-white.svg",
  "Sør-Amerika": "/south-america-white.svg",
  Oseania: "/oseania-white.svg",
}

export function Menu() {
  const { user, isAuthenticated } = useAuth()
  const [practiceCount, setPracticeCount] = useState<number | null>(null)

  useEffect(() => {
    async function loadPracticeCount() {
      if (user) {
        const stats = await getUserStatistics(user.id)
        if (stats?.country_progress) {
          const notMastered = stats.country_progress.filter(
            (c) => !c.is_mastered
          ).length
          setPracticeCount(notMastered)
        }
      }
    }
    loadPracticeCount()
  }, [user])

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-main bg-clip-text text-transparent mb-4">
          Lær verdens land
        </h1>
        <p className="text-lg text-muted-foreground">
          Velg et kontinent eller test deg på alle land
        </p>
      </div>

      {/* Continents Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-muted-foreground mb-6">Kontinenter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {continents.map((continent) => {
            const count = getCountriesByContinent(continent.name).length
            return (
              <Link key={continent.name} to={`/quiz/continent/${continent.name}`}>
                <Card
                  className={cn(
                    "relative overflow-hidden border-0 min-h-20 transition-all duration-normal",
                    "hover:-translate-y-1 hover:scale-[1.02]"
                  )}
                  style={{
                    background: continent.gradient,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 32px ${continent.glowColor}, 0 0 20px ${continent.glowColor}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 32px ${continent.glowColor}, 0 0 20px ${continent.glowColor}`
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <CardContent className="relative z-10 flex items-center gap-3 p-4 text-[var(--card-text)]">
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <img
                        src={continentIcons[continent.name]}
                        alt=""
                        className="w-full h-full object-contain"
                        style={{ filter: 'var(--card-icon-filter)' }}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-base">{continent.name}</span>
                      <Badge
                        variant="secondary"
                        className="w-fit bg-white/20 text-[var(--card-text)] hover:bg-white/30 border-0"
                      >
                        {count} land
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Challenges Section */}
      <section>
        <h2 className="text-2xl font-bold text-muted-foreground mb-6">Utfordringer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* All Countries */}
          <Link to="/quiz/all" className="h-full">
            <Card
              className={cn(
                "relative overflow-hidden border-0 transition-all duration-normal h-full",
                "hover:-translate-y-1 hover:scale-[1.02]"
              )}
              style={{
                background: "var(--gradient-card-3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px var(--glow-card-3), 0 0 20px var(--glow-card-3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px var(--glow-card-3), 0 0 20px var(--glow-card-3)"
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <CardContent className="relative z-10 flex items-center gap-4 p-4 md:p-6 text-[var(--card-text)]">
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-lg">Alle land</span>
                  <span className="text-sm opacity-90">
                    193 FN-medlemmer + 4 anerkjente stater
                  </span>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-white/20 text-[var(--card-text)] hover:bg-white/30 border-0 mt-1"
                  >
                    {countries.length} land
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Practice Mode */}
          {isAuthenticated ? (
            <Link
              to="/quiz/practice"
              className={cn("h-full", practiceCount === 0 && "pointer-events-none")}
              onClick={(e) => practiceCount === 0 && e.preventDefault()}
            >
              <Card
                className={cn(
                  "relative overflow-hidden border-0 transition-all duration-normal h-full",
                  practiceCount !== 0 && "hover:-translate-y-1 hover:scale-[1.02]",
                  practiceCount === 0 && "opacity-60"
                )}
                style={{
                  background: "var(--gradient-card-4)",
                }}
                onMouseEnter={(e) => {
                  if (practiceCount !== 0) {
                    e.currentTarget.style.boxShadow = "0 8px 32px var(--glow-card-4), 0 0 20px var(--glow-card-4)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onTouchStart={(e) => {
                  if (practiceCount !== 0) {
                    e.currentTarget.style.boxShadow = "0 8px 32px var(--glow-card-4), 0 0 20px var(--glow-card-4)"
                  }
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <CardContent className="relative z-10 flex items-center gap-4 p-4 md:p-6 text-[var(--card-text)]">
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">Umestrede land</span>
                    <span className="text-sm opacity-90">
                      Øv på landene du ikke ennå har mestret
                    </span>
                    <Badge
                      variant="secondary"
                      className="w-fit bg-white/20 text-[var(--card-text)] hover:bg-white/30 border-0 mt-1"
                    >
                      {practiceCount === null
                        ? "Laster..."
                        : practiceCount === 0
                        ? "Alle mestret!"
                        : `${practiceCount} land`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div className="pointer-events-none h-full">
              <Card
                className="relative overflow-hidden border-0 opacity-60 h-full"
                style={{
                  background: "var(--gradient-card-4)",
                }}
              >
                <CardContent className="relative z-10 flex items-center gap-4 p-4 md:p-6 text-[var(--card-text)]">
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">Umestrede land</span>
                    <span className="text-sm opacity-90">
                      Øv på landene du ikke ennå har mestret
                    </span>
                    <Badge
                      variant="secondary"
                      className="w-fit bg-white/20 text-[var(--card-text)] hover:bg-white/30 border-0 mt-1"
                    >
                      Logg inn for å bruke
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

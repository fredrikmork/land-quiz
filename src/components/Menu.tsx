import { Link } from "react-router-dom"
import { Globe, BookOpen } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { usePracticeCountries } from "../hooks/usePracticeCountries"
import {
  getCountriesByContinent,
  countries,
  type Continent,
} from "../data/countries"
import { continentIcons } from "../data/constants"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const continents: { name: Continent; accentColor: string }[] = [
  { name: "Europa", accentColor: "var(--accent-primary)" },
  { name: "Asia", accentColor: "var(--accent-secondary)" },
  { name: "Afrika", accentColor: "var(--accent-primary)" },
  { name: "Nord-Amerika", accentColor: "var(--accent-secondary)" },
  { name: "Sør-Amerika", accentColor: "var(--accent-primary)" },
  { name: "Oseania", accentColor: "var(--accent-secondary)" },
]

export function Menu() {
  const { user, isAuthenticated } = useAuth()
  const { practiceCount, loading: practiceLoading } = usePracticeCountries(user)

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12 relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 -top-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
            <Globe size={14} />
            <span>197 land å utforske</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-4">
            Lær verdens land
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Velg et kontinent eller test deg på alle land
          </p>
        </div>
      </div>

      {/* Continents Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <h2 className="text-xl font-bold text-foreground px-2">Kontinenter</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {continents.map((continent) => {
            const count = getCountriesByContinent(continent.name).length
            return (
              <Link key={continent.name} to={`/quiz/continent/${continent.name}`} className="group">
                <Card
                  className={cn(
                    "relative overflow-hidden transition-all duration-200",
                    "bg-card border-2 border-primary/30",
                    "hover:border-primary/60 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.25)]"
                  )}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `color-mix(in srgb, ${continent.accentColor} 15%, transparent)` }}
                    >
                      <img
                        src={continentIcons[continent.name]}
                        alt=""
                        className="w-10 h-10 object-contain"
                        style={{ filter: 'var(--icon-filter-primary)' }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{continent.name}</span>
                      <span className="text-sm text-muted-foreground">{count} land</span>
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
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <h2 className="text-xl font-bold text-foreground px-2">Utfordringer</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* All Countries */}
          <Link to="/quiz/all" className="group h-full">
            <Card
              className={cn(
                "relative overflow-hidden transition-all duration-200 h-full",
                "bg-card border-2 border-primary/30",
                "hover:border-primary/60 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.25)]"
              )}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)' }}
                >
                  <Globe className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-lg text-foreground">Alle land</span>
                  <span className="text-sm text-muted-foreground">
                    Test deg på hele verden
                  </span>
                  <span className="text-xs text-muted-foreground/70 mt-1">
                    {countries.length} land
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Practice Mode */}
          {isAuthenticated ? (
            <Link
              to="/quiz/practice"
              className={cn("group h-full", practiceCount === 0 && "pointer-events-none")}
              tabIndex={practiceCount === 0 ? -1 : undefined}
              aria-disabled={practiceCount === 0 ? "true" : undefined}
              onClick={(e) => practiceCount === 0 && e.preventDefault()}
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-200 h-full",
                  "bg-card border-2 border-primary/30",
                  practiceCount !== 0 && "hover:border-primary/60 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.25)]",
                  practiceCount === 0 && "opacity-50"
                )}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200",
                      practiceCount !== 0 && "group-hover:scale-110"
                    )}
                    style={{ background: 'color-mix(in srgb, var(--accent-secondary) 15%, transparent)' }}
                  >
                    <BookOpen className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-foreground">Øvingsmodus</span>
                    <span className="text-sm text-muted-foreground">
                      Fokuser på land du ikke har mestret
                    </span>
                    <span className="text-xs text-muted-foreground/70 mt-1">
                      {practiceLoading
                        ? "Laster..."
                        : practiceCount === 0
                        ? "Alle land mestret!"
                        : `${practiceCount} land gjenstår`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div className="h-full">
              <Card className="relative overflow-hidden border-2 border-primary/30 opacity-50 h-full bg-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'color-mix(in srgb, var(--accent-secondary) 15%, transparent)' }}
                  >
                    <BookOpen className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-foreground">Øvingsmodus</span>
                    <span className="text-sm text-muted-foreground">
                      Fokuser på land du ikke har mestret
                    </span>
                    <span className="text-xs text-muted-foreground/70 mt-1">
                      Logg inn for å bruke
                    </span>
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

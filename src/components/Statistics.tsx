import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Landmark, Building2, Flag, Map, ArrowLeft, Trophy, Target, Calendar, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react'
import { getUserStatistics, UserStatistics } from '../lib/quizApi'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const quizModes = [
  { key: 'capital-to-country', label: 'Hovedsteder', icon: Landmark },
  { key: 'country-to-capital', label: 'Land', icon: Building2 },
  { key: 'flag-to-country', label: 'Flagg', icon: Flag },
  { key: 'map-to-country', label: 'Kart', icon: Map },
]

// Normalize continent names from database (may have old "Sor-Amerika")
function normalizeContinent(continent: string): string {
  if (continent === 'Sor-Amerika') return 'Sør-Amerika'
  return continent
}

export function Statistics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'continents' | 'countries'>('overview')
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)
  const [completedModes, setCompletedModes] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    if (!user) return
    setLoading(true)
    const data = await getUserStatistics(user.id)
    setStats(data)

    // Fetch which specific modes are completed for each country
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('country_code, quiz_mode')
      .eq('user_id', user.id)
      .eq('is_correct', true)

    console.log('Quiz attempts for modes:', attempts, 'Error:', attemptsError)

    if (attempts) {
      const modesByCountry: Record<string, string[]> = {}
      attempts.forEach((attempt: any) => {
        if (!modesByCountry[attempt.country_code]) {
          modesByCountry[attempt.country_code] = []
        }
        if (!modesByCountry[attempt.country_code].includes(attempt.quiz_mode)) {
          modesByCountry[attempt.country_code].push(attempt.quiz_mode)
        }
      })
      console.log('Completed modes by country:', modesByCountry)
      setCompletedModes(modesByCountry)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Laster statistikk...</p>
        </div>
      </div>
    )
  }

  if (!stats || !stats.overall) {
    return (
      <div className="max-w-6xl mx-auto w-full p-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={18} />
          Tilbake
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gradient-main rounded-full text-white">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Ingen statistikk enda</h2>
          <p className="text-muted-foreground max-w-md">Du har ikke spilt noen quizer enda. Start en quiz for å se statistikk!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={18} />
          Tilbake
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Oppdater
        </Button>
      </div>
      <h2 className="text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent mb-8 text-center">Din statistikk</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:border-border-light transition-all">
          <CardContent className="p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-main rounded-md text-white mb-1">
              <Trophy size={20} />
            </div>
            <span className="text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
              {stats.historical?.lifetime_correct || 0}
            </span>
            <span className="text-sm text-muted-foreground">Totalt riktige</span>
          </CardContent>
        </Card>
        <Card className="hover:border-border-light transition-all">
          <CardContent className="p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-main rounded-md text-white mb-1">
              <Target size={20} />
            </div>
            <span className="text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
              {stats.overall.overall_accuracy}%
            </span>
            <span className="text-sm text-muted-foreground">Treffsikkerhet</span>
          </CardContent>
        </Card>
        <Card className="hover:border-border-light transition-all">
          <CardContent className="p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-main rounded-md text-white mb-1">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
              {stats.mastered_countries?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">Mestrede land</span>
          </CardContent>
        </Card>
        <Card className="hover:border-border-light transition-all">
          <CardContent className="p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-main rounded-md text-white mb-1">
              <Calendar size={20} />
            </div>
            <span className="text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
              {stats.historical?.days_played || 0}
            </span>
            <span className="text-sm text-muted-foreground">Dager spilt</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="w-full bg-card rounded-md p-1 mb-8">
          <TabsTrigger value="overview" className="flex-1">Oversikt</TabsTrigger>
          <TabsTrigger value="continents" className="flex-1">Kontinenter</TabsTrigger>
          <TabsTrigger value="countries" className="flex-1">Land</TabsTrigger>
        </TabsList>

        {/* Tab Content: Overview */}
        <TabsContent value="overview" className="mt-0">
          <div className="space-y-8">
            {/* Best Countries */}
            {stats.best_countries && stats.best_countries.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Dine beste land</h3>
                <div className="space-y-2">
                  {stats.best_countries.map((country) => (
                    <Card key={country.country_code}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <img src={country.flag_url} alt="" className="w-10 h-7 object-cover rounded shadow-sm" />
                        <span className="flex-1 text-foreground font-medium">{country.country_name}</span>
                        <span className="text-green-500 font-bold">{country.accuracy}%</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Spill flere quizer for å se dine beste land!</p>
            )}

            {/* Worst Countries */}
            {stats.worst_countries && stats.worst_countries.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Land du kan øve på</h3>
                <div className="space-y-2">
                  {stats.worst_countries.map((country) => (
                    <Card key={country.country_code}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <img src={country.flag_url} alt="" className="w-10 h-7 object-cover rounded shadow-sm" />
                        <span className="flex-1 text-foreground font-medium">{country.country_name}</span>
                        <span className="text-red-500 font-bold">{country.accuracy}%</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab Content: Continents */}
        <TabsContent value="continents" className="mt-0">
          {selectedContinent ? (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedContinent(null)}
                className="inline-flex items-center gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                Alle kontinenter
              </Button>
              <h3 className="text-2xl font-bold text-foreground">{selectedContinent}</h3>
              {stats.country_progress && (
                <div className="space-y-4">
                  {stats.country_progress
                    .filter((c) => normalizeContinent(c.continent) === selectedContinent)
                    .map((country) => (
                      <Card key={country.code}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={country.flag_url} alt="" className="w-10 h-7 object-cover rounded shadow-sm" />
                            <div className="flex-1">
                              <span className="block font-semibold text-foreground">{country.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {countries.find(c => c.code === country.code)?.capital}
                              </span>
                            </div>
                            {country.is_mastered && <Badge className="bg-green-500 hover:bg-green-600">✓</Badge>}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {quizModes.map((mode) => {
                              const Icon = mode.icon
                              const countryModes = completedModes[country.code] || []
                              const isCompleted = countryModes.includes(mode.key)

                              // Debug logging for first country only
                              if (country.code === 'BR') {
                                console.log(`Brasil - Mode: ${mode.key}, Country modes:`, countryModes, 'Is completed:', isCompleted)
                              }

                              return (
                                <div
                                  key={mode.key}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all",
                                    isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Icon size={14} />
                                  <span>{mode.label}</span>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {(['Europa', 'Asia', 'Afrika', 'Nord-Amerika', 'Sør-Amerika', 'Oseania'] as Continent[]).map((continentName) => {
                const totalCountries = getCountriesByContinent(continentName).length
                const countriesWithProgress = stats.country_progress?.filter(
                  (c) => normalizeContinent(c.continent) === continentName && c.modes_correct > 0
                ).length || 0
                const masteredCountries = stats.country_progress?.filter(
                  (c) => normalizeContinent(c.continent) === continentName && c.is_mastered
                ).length || 0
                const progressPercent = Math.round((masteredCountries / totalCountries) * 100)

                return (
                  <Card
                    key={continentName}
                    className="cursor-pointer hover:border-primary transition-all"
                    onClick={() => setSelectedContinent(continentName)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-lg text-foreground">{continentName}</span>
                            <span className="text-sm text-muted-foreground font-medium">{masteredCountries}/{totalCountries}</span>
                          </div>
                          <Progress value={progressPercent} className="h-1.5 mb-2" />
                          <span className="text-xs text-muted-foreground">
                            {masteredCountries} land mestret · {countriesWithProgress} påbegynt
                          </span>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab Content: Countries */}
        <TabsContent value="countries" className="mt-0 space-y-8">
          {/* Mastered Countries */}
          {stats.mastered_countries && stats.mastered_countries.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Mestrede land (alle 4 moduser)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stats.mastered_countries.map((country) => (
                  <Card key={country.country_code} className="hover:border-primary transition-all">
                    <CardContent className="p-3 flex flex-col items-center gap-2">
                      <img src={country.flag_url} alt="" className="w-full h-12 object-cover rounded shadow-sm" />
                      <span className="text-xs text-center text-foreground font-medium">{country.country_name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Country Progress */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Fremgang per land</h3>
            <div className="flex justify-between text-xs text-muted-foreground mb-3 px-1">
              <span>0/4</span>
              <span>1/4</span>
              <span>2/4</span>
              <span>3/4</span>
              <span>4/4</span>
            </div>
            {stats.country_progress && (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {stats.country_progress.map((country) => (
                  <div
                    key={country.code}
                    className={cn(
                      "relative aspect-[4/3] rounded overflow-hidden border-2 transition-all hover:scale-110 cursor-pointer",
                      country.modes_correct === 0 && "border-muted opacity-50",
                      country.modes_correct === 1 && "border-red-500",
                      country.modes_correct === 2 && "border-yellow-500",
                      country.modes_correct === 3 && "border-blue-500",
                      country.modes_correct === 4 && "border-green-500"
                    )}
                    title={`${country.name}: ${country.modes_correct}/4 moduser`}
                  >
                    <img src={country.flag_url} alt={country.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

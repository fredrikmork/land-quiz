import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Landmark, Building2, Flag, Map, ArrowLeft, Trophy, Target, Calendar, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react'
import { getUserStatistics, UserStatistics } from '../lib/quizApi'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getCountriesByContinent, countries, type Continent } from '../data/countries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
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
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('country_code, quiz_mode')
      .eq('user_id', user.id)
      .eq('is_correct', true)

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
      setCompletedModes(modesByCountry)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Laster statistikk...</p>
        </div>
      </div>
    )
  }

  if (!stats || !stats.overall) {
    return (
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={18} />
          Tilbake
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
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
    <div className="max-w-6xl mx-auto w-full p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
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
      <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-main bg-clip-text text-transparent mb-4 text-center">Din statistikk</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card className="bg-gradient-stat-1 stat-card-glow transition-all duration-300 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Trophy size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
              {stats.historical?.lifetime_correct || 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totalt riktige</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-stat-2 stat-card-glow transition-all duration-300 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg">
              <Target size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
              {stats.overall.overall_accuracy}%
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Treffsikkerhet</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-stat-3 stat-card-glow transition-all duration-300 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
              {stats.mastered_countries?.length || 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mestrede land</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-stat-4 stat-card-glow transition-all duration-300 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center shadow-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold bg-gradient-main bg-clip-text text-transparent">
              {stats.historical?.days_played || 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dager spilt</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="w-full bg-card/50 backdrop-blur rounded-lg p-1.5 mb-6 border border-border/50">
          <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-gradient-button data-[state=active]:text-white rounded-md transition-all">Oversikt</TabsTrigger>
          <TabsTrigger value="continents" className="flex-1 data-[state=active]:bg-gradient-button data-[state=active]:text-white rounded-md transition-all">Kontinenter</TabsTrigger>
          <TabsTrigger value="countries" className="flex-1 data-[state=active]:bg-gradient-button data-[state=active]:text-white rounded-md transition-all">Land</TabsTrigger>
        </TabsList>

        {/* Tab Content: Overview */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Best Countries */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Trophy size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Dine beste land</h3>
              </div>
              {stats.best_countries && stats.best_countries.length > 0 ? (
                <div className="space-y-2">
                  {stats.best_countries.map((country, index) => (
                    <Card key={country.country_code} className="border-border/50 hover:border-emerald-500/50 transition-all">
                      <CardContent className="p-3 flex items-center gap-3">
                        <span className="w-5 text-xs font-bold text-muted-foreground">#{index + 1}</span>
                        <img src={country.flag_url} alt="" className="w-8 h-6 object-cover rounded shadow-sm" />
                        <span className="flex-1 text-foreground font-medium text-sm">{country.country_name}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/30">
                          {country.accuracy}%
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-muted-foreground text-sm">
                    Spill flere quizer for å se dine beste land!
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Worst Countries */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-lg">
                  <Target size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Land du kan øve på</h3>
              </div>
              {stats.worst_countries && stats.worst_countries.length > 0 ? (
                <div className="space-y-2">
                  {stats.worst_countries.map((country, index) => (
                    <Card key={country.country_code} className="border-border/50 hover:border-orange-500/50 transition-all">
                      <CardContent className="p-3 flex items-center gap-3">
                        <span className="w-5 text-xs font-bold text-muted-foreground">#{index + 1}</span>
                        <img src={country.flag_url} alt="" className="w-8 h-6 object-cover rounded shadow-sm" />
                        <span className="flex-1 text-foreground font-medium text-sm">{country.country_name}</span>
                        <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 hover:bg-orange-500/30">
                          {country.accuracy}%
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-muted-foreground text-sm">
                    Ingen land å øve på ennå!
                  </CardContent>
                </Card>
              )}
            </div>
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
                const continentCountries = getCountriesByContinent(continentName)
                const totalCountries = continentCountries.length
                const countriesWithProgress = stats.country_progress?.filter(
                  (c) => normalizeContinent(c.continent) === continentName && c.modes_correct > 0
                ).length || 0
                const masteredCountries = stats.country_progress?.filter(
                  (c) => normalizeContinent(c.continent) === continentName && c.is_mastered
                ).length || 0
                const progressPercent = Math.round((masteredCountries / totalCountries) * 100)
                const previewFlags = continentCountries.slice(0, 5)

                return (
                  <Card
                    key={continentName}
                    className="cursor-pointer continent-card-hover transition-all duration-300 border-border/50 hover:border-primary"
                    onClick={() => setSelectedContinent(continentName)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-xl text-foreground">{continentName}</span>
                            <Badge variant="outline" className="font-semibold">
                              {masteredCountries}/{totalCountries}
                            </Badge>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-progress rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-1">
                              {previewFlags.map((country) => (
                                <img
                                  key={country.code}
                                  src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                  alt=""
                                  className="w-6 h-4 object-cover rounded-sm border border-background shadow-sm"
                                />
                              ))}
                              {totalCountries > 5 && (
                                <div className="w-6 h-4 rounded-sm bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground border border-background">
                                  +{totalCountries - 5}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {countriesWithProgress} påbegynt
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={24} className="text-muted-foreground" />
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-progress flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Mestrede land</h3>
                <Badge className="bg-gradient-progress text-white border-0">
                  {stats.mastered_countries.length}
                </Badge>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {stats.mastered_countries.map((country) => (
                  <div key={country.country_code} className="ring-gradient-mastered rounded-lg group">
                    <Card className="border-0 bg-card h-full transition-all duration-200 group-hover:bg-card/80">
                      <CardContent className="p-3 flex flex-col items-center gap-2">
                        <img src={country.flag_url} alt="" className="w-full h-10 object-cover rounded shadow-sm" />
                        <span className="text-xs text-center text-foreground font-medium line-clamp-1">{country.country_name}</span>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Country Progress */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Fremgang per land</h3>
            <div className="flex items-center gap-4 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm bg-muted/50" />
                <span className="text-muted-foreground">0/4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm border-2 border-red-500" />
                <span className="text-muted-foreground">1/4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm border-2 border-yellow-500" />
                <span className="text-muted-foreground">2/4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm border-2 border-blue-500" />
                <span className="text-muted-foreground">3/4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm bg-gradient-progress" />
                <span className="text-muted-foreground">4/4</span>
              </div>
            </div>
            {stats.country_progress && (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {stats.country_progress.map((country) => (
                  <div
                    key={country.code}
                    className="group relative"
                    title={`${country.name}: ${country.modes_correct}/4 moduser`}
                  >
                    {country.modes_correct === 4 ? (
                      <div className="ring-gradient-mastered rounded-md">
                        <div className="aspect-[4/3] rounded overflow-hidden bg-background flag-hover transition-all duration-200 cursor-pointer">
                          <img src={country.flag_url} alt={country.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "aspect-[4/3] rounded overflow-hidden border-2 flag-hover transition-all duration-200 cursor-pointer",
                          country.modes_correct === 0 && "border-muted/50 opacity-40 grayscale",
                          country.modes_correct === 1 && "border-red-500",
                          country.modes_correct === 2 && "border-yellow-500",
                          country.modes_correct === 3 && "border-blue-500"
                        )}
                      >
                        <img src={country.flag_url} alt={country.name} className="w-full h-full object-cover" />
                      </div>
                    )}
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

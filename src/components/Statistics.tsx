import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Landmark, Building2, Flag, Map, ArrowLeft, Trophy, Target, Calendar, CheckCircle2, ChevronRight, RefreshCw, ChevronDown, Circle, CircleDot } from 'lucide-react'
import { getUserStatistics, UserStatistics } from '../lib/quizApi'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getCountriesByContinent, countries, getHighResFlag, type Continent } from '../data/countries'
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

// Progress level configuration
const progressLevels = [
  {
    level: 4,
    label: 'MESTRET',
    sublabel: '4/4',
    icon: CheckCircle2,
    bgClass: 'bg-gradient-to-br from-emerald-500/20 to-green-500/10',
    borderClass: 'border-emerald-500/30',
    iconBgClass: 'bg-gradient-to-br from-emerald-400 to-green-500',
    textClass: 'text-emerald-500',
  },
  {
    level: 3,
    label: 'NESTEN',
    sublabel: '3/4',
    icon: CircleDot,
    bgClass: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10',
    borderClass: 'border-blue-500/30',
    iconBgClass: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    textClass: 'text-blue-500',
  },
  {
    level: 2,
    label: 'HALVVEIS',
    sublabel: '2/4',
    icon: CircleDot,
    bgClass: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/10',
    borderClass: 'border-yellow-500/30',
    iconBgClass: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    textClass: 'text-yellow-500',
  },
  {
    level: 1,
    label: 'PÅBEGYNT',
    sublabel: '1/4',
    icon: CircleDot,
    bgClass: 'bg-gradient-to-br from-orange-500/20 to-red-500/10',
    borderClass: 'border-orange-500/30',
    iconBgClass: 'bg-gradient-to-br from-orange-400 to-red-500',
    textClass: 'text-orange-500',
  },
  {
    level: 0,
    label: 'IKKE STARTET',
    sublabel: '0/4',
    icon: Circle,
    bgClass: 'bg-muted/30',
    borderClass: 'border-muted/50',
    iconBgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
  },
]

interface CountryProgress {
  code: string
  name: string
  flag_url: string
  continent: string
  modes_correct: number
  is_mastered: boolean
}

function CountryProgressGroups({ countryProgress }: { countryProgress: CountryProgress[] }) {
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({
    4: true,
    3: true,
    2: true,
    1: true,
    0: false,
  })

  const groupedCountries = useMemo(() => {
    const groups: Record<number, CountryProgress[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] }
    countryProgress.forEach((country) => {
      const level = Math.min(country.modes_correct, 4)
      groups[level].push(country)
    })
    // Sort each group alphabetically
    Object.keys(groups).forEach((key) => {
      groups[Number(key)].sort((a, b) => a.name.localeCompare(b.name, 'nb'))
    })
    return groups
  }, [countryProgress])

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => ({ ...prev, [level]: !prev[level] }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Fremgang per land</h2>

      {progressLevels.map((config) => {
        const countriesAtLevel = groupedCountries[config.level]
        const isExpanded = expandedLevels[config.level]
        const Icon = config.icon

        if (countriesAtLevel.length === 0) return null

        return (
          <Card
            key={config.level}
            className={cn(
              'border transition-all duration-200',
              config.bgClass,
              config.borderClass
            )}
          >
            <button
              onClick={() => toggleLevel(config.level)}
              aria-expanded={isExpanded}
              aria-controls={`countries-level-${config.level}`}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shadow-md',
                  config.iconBgClass
                )}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <span className={cn('font-bold text-sm', config.textClass)}>
                    {config.label}
                  </span>
                  <span className="text-muted-foreground text-sm ml-2">
                    ({config.sublabel})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn('font-semibold', config.textClass)}>
                  {countriesAtLevel.length} land
                </Badge>
                <ChevronDown
                  size={20}
                  className={cn(
                    'text-muted-foreground transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )}
                />
              </div>
            </button>

            {isExpanded && (
              <CardContent id={`countries-level-${config.level}`} className="pt-0 pb-4 px-4">
                <div className="flex flex-wrap gap-3">
                  {countriesAtLevel.map((country) => (
                    <div
                      key={country.code}
                      className="group relative"
                      tabIndex={0}
                      aria-label={country.name}
                    >
                      <div className="w-14 h-10 rounded-md overflow-hidden bg-white shadow-md border border-border/50">
                        <img
                          src={getHighResFlag(country.flag_url)}
                          alt={country.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {/* Tooltip on hover/focus */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {country.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Laster statistikk" />
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
          <div className="w-24 h-24 flex items-center justify-center bg-primary rounded-full text-primary-foreground">
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
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-all"
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
      <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 text-center">Din statistikk</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card className="bg-gradient-stat-1 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Trophy size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold text-primary">
              {stats.historical?.lifetime_correct || 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totalt riktige</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-stat-2 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg">
              <Target size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold text-primary">
              {stats.overall.overall_accuracy}%
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Treffsikkerhet</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-stat-3 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold text-primary">
              {stats.mastered_countries?.length || 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mestrede land</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-stat-4 border-0">
          <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center shadow-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-extrabold text-primary">
              {stats.historical?.days_played || 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dager spilt</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="w-full bg-card/50 backdrop-blur rounded-lg p-1.5 mb-6 border border-border/50" aria-label="Statistikkvisninger">
          <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-gradient-button data-[state=active]:text-white rounded-md transition-all">Oversikt</TabsTrigger>
          <TabsTrigger value="continents" className="flex-1 data-[state=active]:bg-gradient-button data-[state=active]:text-white rounded-md transition-all">Kontinenter</TabsTrigger>
          <TabsTrigger value="countries" className="flex-1 data-[state=active]:bg-gradient-button data-[state=active]:text-white rounded-md transition-all">Land</TabsTrigger>
        </TabsList>

        {/* Tab Content: Overview */}
        <TabsContent value="overview" className="mt-0 min-h-[400px]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Best Countries */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Trophy size={16} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Dine beste land</h2>
              </div>
              {stats.best_countries && stats.best_countries.length > 0 ? (
                <div className="space-y-2">
                  {stats.best_countries.map((country, index) => (
                    <Card key={country.country_code} className="border-border/50">
                      <CardContent className="p-3 flex items-center gap-3">
                        <span className="w-5 text-xs font-bold text-muted-foreground">#{index + 1}</span>
                        <div className="w-10 h-7 rounded shadow-sm bg-white flex-shrink-0 overflow-hidden">
                          <img src={getHighResFlag(country.flag_url)} alt={`Flagget til ${country.country_name}`} className="w-full h-full object-contain" />
                        </div>
                        <span className="flex-1 text-foreground font-medium text-sm">{country.country_name}</span>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
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
                <h2 className="text-lg font-bold text-foreground">Land du kan øve på</h2>
              </div>
              {stats.worst_countries && stats.worst_countries.length > 0 ? (
                <div className="space-y-2">
                  {stats.worst_countries.map((country, index) => (
                    <Card key={country.country_code} className="border-border/50">
                      <CardContent className="p-3 flex items-center gap-3">
                        <span className="w-5 text-xs font-bold text-muted-foreground">#{index + 1}</span>
                        <div className="w-10 h-7 rounded shadow-sm bg-white flex-shrink-0 overflow-hidden">
                          <img src={getHighResFlag(country.flag_url)} alt={`Flagget til ${country.country_name}`} className="w-full h-full object-contain" />
                        </div>
                        <span className="flex-1 text-foreground font-medium text-sm">{country.country_name}</span>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
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
        <TabsContent value="continents" className="mt-0 min-h-[400px]">
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
              <h2 className="text-2xl font-bold text-foreground">{selectedContinent}</h2>
              {stats.country_progress && (
                <div className="space-y-4">
                  {stats.country_progress
                    .filter((c) => normalizeContinent(c.continent) === selectedContinent)
                    .map((country) => (
                      <Card
                        key={country.code}
                        className={cn(
                          "transition-all",
                          country.is_mastered
                            ? "border-emerald-500/50 bg-emerald-500/5"
                            : "border-border/50"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-8 rounded shadow-sm bg-white flex-shrink-0 overflow-hidden">
                              <img src={getHighResFlag(country.flag_url)} alt={`Flagget til ${country.name}`} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                              <span className={cn(
                                "block font-semibold",
                                country.is_mastered ? "text-emerald-500" : "text-foreground"
                              )}>{country.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {countries.find(c => c.code === country.code)?.capital}
                              </span>
                            </div>
                            {country.is_mastered && (
                              <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 gap-1">
                                <CheckCircle2 size={12} />
                                Mestret
                              </Badge>
                            )}
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
                                    isCompleted
                                      ? country.is_mastered
                                        ? "bg-emerald-500/20 text-emerald-500"
                                        : "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
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
                const isCompleted = masteredCountries === totalCountries

                return (
                  <Card
                    key={continentName}
                    className={cn(
                      "cursor-pointer continent-card-hover transition-all duration-300",
                      isCompleted
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border/50 hover:border-primary"
                    )}
                    onClick={() => setSelectedContinent(continentName)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-xl text-foreground">{continentName}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-semibold gap-1",
                                isCompleted && "border-emerald-500/50 text-emerald-500"
                              )}
                            >
                              {isCompleted && <CheckCircle2 size={12} />}
                              {masteredCountries}/{totalCountries}
                            </Badge>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                isCompleted ? "bg-emerald-500" : "bg-gradient-progress"
                              )}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-1">
                              {previewFlags.map((country) => (
                                <div key={country.code} className="w-7 h-5 rounded-sm border border-background shadow-sm bg-white overflow-hidden">
                                  <img
                                    src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                    alt={country.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ))}
                              {totalCountries > 5 && (
                                <div className="w-6 h-4 rounded-sm bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground border border-background">
                                  +{totalCountries - 5}
                                </div>
                              )}
                            </div>
                            <span className={cn(
                              "text-xs",
                              isCompleted ? "text-emerald-500" : "text-muted-foreground"
                            )}>
                              {isCompleted ? `${masteredCountries} mestret` : `${countriesWithProgress} påbegynt`}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={24} className={isCompleted ? "text-emerald-500" : "text-muted-foreground"} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab Content: Countries */}
        <TabsContent value="countries" className="mt-0 min-h-[400px] space-y-4">
          <CountryProgressGroups
            countryProgress={stats.country_progress || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

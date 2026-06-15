const ICONS = {
    grains: 'bi-basket2',
    tubers: 'bi-basket2',
    legumes: 'bi-nut',
    vegetables: 'bi-flower1',
    plantains: 'bi-tree',
    fruits: 'bi-apple',
    cash_crops: 'bi-tree-fill',
    herbs: 'bi-leaf',
    planting: 'bi-flower1',
    harvesting: 'bi-basket2',
    spraying: 'bi-droplet-half',
    irrigation: 'bi-moisture',
    weeding: 'bi-flower2',
    tillage: 'bi-tools',
    fertilizing: 'bi-bag-plus',
    pruning: 'bi-scissors',
    general: 'bi-list-task',
    alert: 'bi-exclamation-triangle',
    calendar: 'bi-calendar3',
    note: 'bi-card-text',
    search: 'bi-search',
    ai: 'bi-stars',
    light: 'bi-lightbulb',
    mail: 'bi-envelope',
    trash: 'bi-trash3',
    location: 'bi-geo-alt',
    clear: 'bi-check-circle',
    farmer: 'bi-person-lines-fill',
    admin: 'bi-shield-lock',
    rules: 'bi-sliders',
    temperature: 'bi-thermometer-half',
    rain: 'bi-cloud-rain',
    humidity: 'bi-droplet',
    wind: 'bi-wind',
    flood: 'bi-water',
    night: 'bi-moon',
    morning: 'bi-sunrise',
    afternoon: 'bi-brightness-high',
    weather: 'bi-cloud-sun',
}

const SYMBOL_ICONS = {
    '\uD83C\uDF3E': ICONS.grains,
    '\uD83E\uDD54': ICONS.tubers,
    '\uD83E\uDED8': ICONS.legumes,
    '\uD83C\uDF45': ICONS.vegetables,
    '\uD83C\uDF4C': ICONS.plantains,
    '\uD83C\uDF4A': ICONS.fruits,
    '\uD83C\uDF34': ICONS.cash_crops,
    '\uD83C\uDF3F': ICONS.herbs,
    '\uD83C\uDF31': ICONS.planting,
    '\uD83E\uDDF4': ICONS.spraying,
    '\uD83D\uDEBF': ICONS.irrigation,
    '\uD83E\uDE9A': ICONS.weeding,
    '\uD83D\uDE9C': ICONS.tillage,
    '\uD83E\uDDFA': ICONS.fertilizing,
    '\u2702\uFE0F': ICONS.pruning,
    '\uD83D\uDCCB': ICONS.general,
    '\uD83C\uDF21': ICONS.temperature,
    '\u26C8': 'bi-cloud-lightning-rain',
    '\uD83C\uDF26': 'bi-cloud-drizzle',
    '\uD83C\uDF27': ICONS.rain,
    '\uD83C\uDF28': 'bi-snow',
    '\u2744\uFE0F': 'bi-snow2',
    '\uD83C\uDF2B': 'bi-cloud-fog2',
    '\u2600\uFE0F': ICONS.afternoon,
    '\uD83C\uDF24': ICONS.weather,
    '\u26C5': ICONS.weather,
    '\u2601\uFE0F': 'bi-cloud',
    '\uD83D\uDCA7': ICONS.humidity,
    '\uD83D\uDCA8': ICONS.wind,
    '\uD83C\uDF0A': ICONS.flood,
    '\uD83C\uDF19': ICONS.night,
    '\uD83C\uDF05': ICONS.morning,
    '\u26A0\uFE0F': ICONS.alert,
    '\u2705': ICONS.clear,
    '\uD83D\uDCC5': ICONS.calendar,
    '\uD83D\uDDD1\uFE0F': ICONS.trash,
    '\uD83D\uDCE7': ICONS.mail,
    '\uD83D\uDCA1': ICONS.light,
    '\uD83E\uDD16': ICONS.ai,
}

export const WEATHER_ICON = ICONS.weather

export const iconClass = (name, fallback = 'bi-circle') => {
    if (!name) return fallback
    if (name.startsWith('bi-')) return name
    return ICONS[name] || SYMBOL_ICONS[name] || fallback
}

export const timingLabel = (timing) => {
    if (timing === 'night') return 'Night'
    if (timing === 'morning') return 'Morning'
    if (timing === 'afternoon') return 'Afternoon'
    return 'Intermittent'
}

export const timingIconName = (timing) => {
    if (timing === 'night') return 'night'
    if (timing === 'morning') return 'morning'
    if (timing === 'afternoon') return 'afternoon'
    return 'rain'
}

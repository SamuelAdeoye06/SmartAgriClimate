const EMOJIS = {
    grains: '🌾',
    tubers: '🥔',
    legumes: '🫘',
    vegetables: '🍅',
    plantains: '🍌',
    fruits: '🍊',
    cash_crops: '🌴',
    herbs: '🌿',
    planting: '🌱',
    harvesting: '🌾',
    spraying: '🧴',
    irrigation: '🚿',
    weeding: '🌿',
    tillage: '🚜',
    fertilizing: '🧺',
    pruning: '✂️',
    general: '📋',
    calendar: '📅',
    note: '📝',
    search: '🔍',
    alert: '⚠️',
    clear: '✅',
    temperature: '🌡',
    rain: '🌧',
    humidity: '💧',
    wind: '💨',
    flood: '🌊',
    night: '🌙',
    morning: '🌤',
    afternoon: '☀️',
    weather: '🌤',
    light: '💡',
}

const ICON_TO_EMOJI = {
    'bi-circle-fill': '🟡',
    'bi-flower1': '😔',
    'bi-ui-radios-grid': '🕳️',
    'bi-square': '⬜',
    'bi-record-circle': '🟫',
    'bi-circle': '⚫',
    'bi-graph-down': '📉',
    'bi-flower2': '🌿',
    'bi-tree': '🪵',
    'bi-leaf': '🍃',
    'bi-diamond': '🔶',
    'bi-leaf-fill': '🍂',
    'bi-bug': '🐛',
    'bi-grid-3x3-gap': '🕳️',
    'bi-flower3': '🌸',
}

const WEATHER_EMOJIS = {
    '🌡': '🌡',
    '⛈': '⛈',
    '🌦': '🌦',
    '🌧': '🌧',
    '🌨': '🌨',
    '❄️': '❄️',
    '🌫': '🌫',
    '☀️': '☀️',
    '🌤': '🌤',
    '⛅': '⛅',
    '☁️': '☁️',
}

export const emojiFor = (name, fallback = '🌱') => {
    if (!name) return fallback
    return EMOJIS[name] || ICON_TO_EMOJI[name] || WEATHER_EMOJIS[name] || fallback
}

export const weatherEmoji = (icon, fallback = '🌤') => emojiFor(icon, fallback)

export const timingEmoji = (timing) => {
    if (timing === 'night') return EMOJIS.night
    if (timing === 'morning') return EMOJIS.morning
    if (timing === 'afternoon') return EMOJIS.afternoon
    return EMOJIS.rain
}

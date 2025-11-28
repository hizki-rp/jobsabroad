/**
 * Country flag emoji mapping
 * Returns flag emoji for country names
 */
export const getCountryFlag = (countryName: string): string => {
  const countryMap: Record<string, string> = {
    'Germany': '🇩🇪',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'France': '🇫🇷',
    'Netherlands': '🇳🇱',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Belgium': '🇧🇪',
    'Ireland': '🇮🇪',
    'New Zealand': '🇳🇿',
    'Singapore': '🇸🇬',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'UAE': '🇦🇪',
    'United Arab Emirates': '🇦🇪',
    'Qatar': '🇶🇦',
    'Saudi Arabia': '🇸🇦',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Portugal': '🇵🇹',
    'Poland': '🇵🇱',
    'Czech Republic': '🇨🇿',
    'Greece': '🇬🇷',
    'Turkey': '🇹🇷',
    'South Africa': '🇿🇦',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'India': '🇮🇳',
    'China': '🇨🇳',
    'Russia': '🇷🇺',
    'Ethiopia': '🇪🇹',
  }

  // Try exact match first
  if (countryMap[countryName]) {
    return countryMap[countryName]
  }

  // Try case-insensitive match
  const normalized = countryName.trim()
  for (const [key, flag] of Object.entries(countryMap)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return flag
    }
  }

  // Return globe emoji as fallback
  return '🌍'
}


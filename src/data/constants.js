export function severity(min) {
  if (min <= 10) return 'short';
  if (min <= 25) return 'medium';
  return 'long';
}

export const severityColors = {
  short: { border: 'border-l-red-300', text: 'text-red-300', bg: 'bg-red-50', badgeText: 'text-red-800', badgeBorder: 'border-red-300', pin: 'bg-red-300', pinText: 'text-red-900' },
  medium: { border: 'border-l-red-600', text: 'text-red-600', bg: 'bg-red-100', badgeText: 'text-red-900', badgeBorder: 'border-red-600', pin: 'bg-red-600', pinText: 'text-white' },
  long: { border: 'border-l-red-900', text: 'text-red-900', bg: 'bg-red-300', badgeText: 'text-red-950', badgeBorder: 'border-red-900', pin: 'bg-red-900', pinText: 'text-white' }
};
export function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getDurationSec(start: string, end: string) {
  return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
}

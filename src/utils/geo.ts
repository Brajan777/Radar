/**
 * Geolocation & Distance Calculation Utilities for Villa Nueva
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// Haversine formula to compute distance in Kilometers between two coordinates
export function calculateDistanceKm(point1: LatLng, point2: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Format human-friendly distance
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `a ${meters} metros de ti`;
  }
  return `a ${distanceKm.toFixed(1)} km`;
}

// Estimate travel times in Villa Nueva traffic
export function estimateTravelTime(distanceKm: number): { walkingMin: number; drivingMin: number } {
  // Average walking: 4.8 km/h => ~12.5 min per km
  const walkingMin = Math.round(distanceKm * 12.5);
  // Average urban vehicle in VN: 20 km/h with traffic => ~3 min per km + 3 min baseline
  const drivingMin = Math.max(3, Math.round(distanceKm * 3.2 + 2));
  return { walkingMin, drivingMin };
}

// Check push notification permission and dispatch simulated browser notification
export async function triggerBrowserPushNotification(
  title: string,
  body: string,
  iconUrl?: string
): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones de escritorio');
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: iconUrl || '/favicon.ico',
        badge: '/favicon.ico',
      });
      return true;
    } catch {
      return false;
    }
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: iconUrl || '/favicon.ico',
        });
        return true;
      } catch {
        return false;
      }
    }
  }
  return false;
}

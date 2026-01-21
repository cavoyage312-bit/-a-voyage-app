
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1'; // Mode test

let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Récupère un token d'accès valide pour l'API Amadeus
 */
async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_CLIENT_ID || '',
      client_secret: AMADEUS_CLIENT_SECRET || '',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Amadeus API');
  }

  const data = await response.json();
  accessToken = data.access_token;
  // Expire un peu avant la vraie expiration pour être sûr
  tokenExpiry = now + (data.expires_in * 1000) - 60000;

  return accessToken;
}

/**
 * Recherche de vols (Flight Offers Search)
 */
export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: string;
  max?: string;
}) {
  const token = await getAccessToken();
  // IMPORTANT: Flight Offers Search est en V2
  const url = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');

  // Ajout des paramètres
  Object.keys(params).forEach(key => url.searchParams.append(key, (params as any)[key]));

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.error('Amadeus API Error:', await response.text());
    throw new Error('Failed to fetch flight offers');
  }

  return response.json();
}

/**
 * Recherche d'aéroports et villes (Airport & City Search)
 */
export async function searchLocations(keyword: string) {
  const token = await getAccessToken();
  const url = new URL(`${AMADEUS_BASE_URL}/reference-data/locations`);

  url.searchParams.append('subType', 'AIRPORT,CITY');
  url.searchParams.append('keyword', keyword);
  url.searchParams.append('page[limit]', '10');

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.error('Amadeus API Error:', await response.text());
    return { data: [] }; // Fallback vide
  }

  return response.json();
}

/**
 * Recherche d'hôtels par code ville (Hotel List)
 */
export async function searchHotels(cityCode: string) {
  const token = await getAccessToken();
  const url = new URL(`${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city`);

  url.searchParams.append('cityCode', cityCode);
  url.searchParams.append('radius', '20');

  // Note: En mode test, Amadeus ne renvoie que quelques hôtels précis pour les villes supportées (PAR, LON, NYC...)
  // On limite à 20 résultats

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.error('Amadeus API Error:', await response.text());
    throw new Error('Failed to fetch hotels');
  }

  return response.json();
}

/**
 * Recherche de transferts/voitures
 * Note: En environnement de test, l'API Transferts est souvent plus fiable que Car Rental pour avoir des résultats
 */
export async function searchCars(cityCode: string) {
  const token = await getAccessToken();

  // Utilisation de Airport Transfers pour simuler la location/VTC
  const url = new URL(`${AMADEUS_BASE_URL}/shopping/transfer-offers`);

  // On simule une demande de transfert depuis l'aéroport de la ville
  // car l'API demande un startLocationCode précis
  url.searchParams.append('startLocationCode', cityCode);
  url.searchParams.append('endCityCode', cityCode); // Transfert intra-ville pour l'exemple
  url.searchParams.append('transferType', 'PRIVATE');
  url.searchParams.append('startDateTime', new Date(Date.now() + 86400000).toISOString().split('.')[0]); // Demain
  url.searchParams.append('passengers', '2');

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    // Si l'API Transfer fail, on fallback sur une liste vide (et on mocker dans la route API comme pour les hôtels)
    console.warn('Amadeus Transfer API empty/fail in test mode, using fallback');
    return { data: [] };
  }

  return response.json();
}

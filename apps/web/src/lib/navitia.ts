
// Simulation du client Navitia (en attendant la clé API)

export interface TransitJourney {
    duration: number; // secondes
    departure_date_time: string;
    arrival_date_time: string;
    sections: {
        type: 'public_transport' | 'street_network' | 'waiting' | 'transfer';
        mode?: string; // walking, bus, metro, tram, train
        duration: number;
        from?: { name: string };
        to?: { name: string };
        display_informations?: {
            code: string; // Ligne 1, A, etc.
            color: string; // Hex color
            name: string; // Direction
            network: string; // RATP, SNCF...
            physical_mode: string; // Métro, Bus...
        };
    }[];
}

export async function searchJourneys(from: string, to: string): Promise<TransitJourney[]> {
    // En production : 
    // const res = await fetch(`https://api.navitia.io/v1/coverage/fr-idf/journeys?from=${from}&to=${to}`, { headers: { Authorization: KEY } });

    // Simulation d'une réponse Navitia (Itinéraire Parisien typique)
    return [
        {
            duration: 2700, // 45 min
            departure_date_time: '20240320T083000',
            arrival_date_time: '20240320T091500',
            sections: [
                {
                    type: 'street_network',
                    mode: 'walking',
                    duration: 300, // 5 min
                    from: { name: 'Départ' },
                    to: { name: 'Station Métro' }
                },
                {
                    type: 'public_transport',
                    duration: 1200, // 20 min
                    from: { name: 'Châtelet' },
                    to: { name: 'La Défense' },
                    display_informations: {
                        code: 'A',
                        color: 'FF0000',
                        name: 'RER A',
                        network: 'RATP',
                        physical_mode: 'RER'
                    }
                },
                {
                    type: 'street_network',
                    mode: 'walking',
                    duration: 600, // 10 min
                    from: { name: 'La Défense' },
                    to: { name: 'Arrivée' }
                }
            ]
        },
        {
            duration: 3200, // 53 min
            departure_date_time: '20240320T083500',
            arrival_date_time: '20240320T092800',
            sections: [
                {
                    type: 'public_transport',
                    duration: 1500,
                    from: { name: 'Opéra' },
                    to: { name: 'Bastille' },
                    display_informations: {
                        code: '1',
                        color: 'FFCD00',
                        name: 'Métro 1',
                        network: 'RATP',
                        physical_mode: 'Metro'
                    }
                },
                {
                    type: 'public_transport',
                    duration: 900,
                    from: { name: 'Bastille' },
                    to: { name: 'Gare de Lyon' },
                    display_informations: {
                        code: '87',
                        color: '0055C8',
                        name: 'Bus 87',
                        network: 'RATP',
                        physical_mode: 'Bus'
                    }
                }
            ]
        }
    ];
}

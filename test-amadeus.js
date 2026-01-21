const fs = require('fs');
const path = require('path');

// Lecture manuelle du .env.local
const envPath = path.resolve('apps/web/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
    const match = envContent.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : null;
};

const client_id = getEnv('AMADEUS_CLIENT_ID');
const client_secret = getEnv('AMADEUS_CLIENT_SECRET');

async function test() {
    try {
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Connexion REUSSIE !');

            const origin = 'PAR';
            const dest = 'CMN';
            const date = '2026-03-10';

            console.log(`Action: Recherche ${origin} -> ${dest} au ${date}`);

            const searchRes = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${dest}&departureDate=${date}&adults=1&max=5`, {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });

            const searchData = await searchRes.json();
            if (searchRes.ok) {
                console.log('✅ RECHERCHE OK !');
                console.log('Vols trouvés:', searchData.meta?.count || 0);
                if (searchData.data) {
                    console.log('Exemple de vol:', searchData.data[0]?.id);
                }
            } else {
                console.log('❌ ERREUR RECHERCHE:', JSON.stringify(searchData, null, 2));
            }
        } else {
            console.log('❌ ÉCHEC CONNEXION:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('💥 Erreur:', error.message);
    }
}

test();

const fs = require('fs');
const path = require('path');

const envPath = path.resolve('apps/web/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
    const match = envContent.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : null;
};

const client_id = getEnv('AMADEUS_CLIENT_ID');
const client_secret = getEnv('AMADEUS_CLIENT_SECRET');

async function test() {
    const authResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
    });
    const authData = await authResponse.json();
    const token = authData.access_token;

    console.log('--- Test Recherche Locations pour "DKR" ---');
    const res = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=DKR`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('DKR results:', data.data?.length || 0);

    console.log('--- Test Recherche Locations pour "SENEGAL" ---');
    const res2 = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=SENEGAL`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data2 = await res2.json();
    console.log('SENEGAL results:', data2.data?.length || 0);
}

test();

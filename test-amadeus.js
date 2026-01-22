
const clientId = 'DMJkbydA3CADWsqpAHpAiQHjepWUA2II';
const clientSecret = 'nR18APX045ZbEptw';

async function testAmadeus() {
    let output = '--- TEST RESULTS ---\n';
    try {
        const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret
            })
        });

        if (!tokenRes.ok) {
            output += `Token Error: ${tokenRes.status} ${await tokenRes.text()}\n`;
            console.log(output);
            return;
        }

        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;
        output += 'Token: OK\n';

        const flightRes = await fetch('https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MAD&destinationLocationCode=PAR&departureDate=2026-03-01&adults=1&max=2', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!flightRes.ok) {
            output += `Flight Search Error: ${flightRes.status} ${await flightRes.text()}\n`;
        } else {
            const flights = await flightRes.json();
            output += `Flights Found: ${flights.data?.length || 0}\n`;
        }

        const hotelRes = await fetch('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=PAR&radius=5', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!hotelRes.ok) {
            output += `Hotel Search Error: ${hotelRes.status} ${await hotelRes.text()}\n`;
        } else {
            const hotels = await hotelRes.json();
            output += `Hotels Found: ${hotels.data?.length || 0}\n`;
        }

        const locRes = await fetch('https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=PARIS&page[limit]=2', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!locRes.ok) {
            output += `Location Search Error: ${locRes.status} ${await locRes.text()}\n`;
        } else {
            const locs = await locRes.json();
            output += `Locations Found: ${locs.data?.length || 0}\n`;
        }

    } catch (err) {
        output += `Unexpected error: ${err.message}\n`;
    }
    console.log(output);
}

testAmadeus();

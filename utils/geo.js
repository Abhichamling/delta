// utils/geo.js
const axios = require('axios');

async function extractCoordinatesFromGoogleMapsUrl(url) {
    try {
        // Default to Kathmandu if no URL
        if (!url || url.trim() === '') {
            console.log('⚠️ No URL provided, using default Kathmandu coordinates');
            return { lat: 27.7172, lng: 85.3240 };
        }

        console.log('🔍 Extracting coordinates from URL:', url);
        
        // Handle different Google Maps URL formats
        
        // Format 1: https://maps.app.goo.gl/XXX or goo.gl links
        if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
            try {
                // Follow redirect to get actual URL
                const response = await axios.get(url, { 
                    maxRedirects: 5, 
                    validateStatus: null,
                    timeout: 5000
                });
                
                // Get the final URL after redirects
                const resolvedUrl = response.request.res.responseUrl || url;
                console.log('🔄 Resolved short URL to:', resolvedUrl);
                
                // Try to extract coordinates from resolved URL
                return extractFromUrlString(resolvedUrl);
            } catch (redirectError) {
                console.log('⚠️ Error following redirect, trying direct extraction');
                return extractFromUrlString(url);
            }
        } 
        // Format 2: Direct Google Maps URL with @ coordinates
        else {
            return extractFromUrlString(url);
        }
        
    } catch (error) {
        console.error('❌ Error extracting coordinates:', error.message);
        return { lat: 27.7172, lng: 85.3240 };
    }
}

function extractFromUrlString(url) {
    // Default to Kathmandu
    let lat = 27.7172;
    let lng = 85.3240;
    
    try {
        // Pattern 1: @lat,lng or @lat,lng,zoom
        // Example: https://www.google.com/maps/place/Kathmandu/@27.7172,85.3240,15z
        const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const atMatch = url.match(atPattern);
        
        if (atMatch) {
            lat = parseFloat(atMatch[1]);
            lng = parseFloat(atMatch[2]);
            console.log('✅ Extracted from @ pattern:', { lat, lng });
            return { lat, lng };
        }
        
        // Pattern 2: 3d27.7172!4d85.3240 (Google Maps format)
        const dPattern = /3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
        const dMatch = url.match(dPattern);
        
        if (dMatch) {
            lat = parseFloat(dMatch[1]);
            lng = parseFloat(dMatch[2]);
            console.log('✅ Extracted from 3d!4d pattern:', { lat, lng });
            return { lat, lng };
        }
        
        // Pattern 3: ll=lat,lng in query parameters
        // Need to ensure URL has protocol for URL constructor
        let urlToParse = url;
        if (!urlToParse.startsWith('http')) {
            urlToParse = 'https://' + urlToParse;
        }
        
        try {
            const urlObj = new URL(urlToParse);
            const params = urlObj.searchParams;
            
            if (params.has('ll')) {
                const ll = params.get('ll').split(',');
                if (ll.length === 2) {
                    lat = parseFloat(ll[0]);
                    lng = parseFloat(ll[1]);
                    console.log('✅ Extracted from ll parameter:', { lat, lng });
                    return { lat, lng };
                }
            }
            
            if (params.has('q')) {
                const q = params.get('q');
                const qMatch = q.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (qMatch) {
                    lat = parseFloat(qMatch[1]);
                    lng = parseFloat(qMatch[2]);
                    console.log('✅ Extracted from q parameter:', { lat, lng });
                    return { lat, lng };
                }
            }
        } catch (urlError) {
            console.log('⚠️ URL parsing error, trying other methods');
        }
        
        // Pattern 4: Try to find coordinates in the URL path
        // Example: /maps/place/Kathmandu/@27.7172,85.3240
        const pathPattern = /\/@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const pathMatch = url.match(pathPattern);
        
        if (pathMatch) {
            lat = parseFloat(pathMatch[1]);
            lng = parseFloat(pathMatch[2]);
            console.log('✅ Extracted from path pattern:', { lat, lng });
            return { lat, lng };
        }
        
        console.log('⚠️ No coordinates found in URL, using defaults');
        return { lat, lng };
        
    } catch (e) {
        console.log('❌ Error parsing URL:', e.message);
        return { lat, lng };
    }
}

module.exports = { extractCoordinatesFromGoogleMapsUrl };
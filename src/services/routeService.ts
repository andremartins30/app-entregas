import api from './api';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface RouteInfo {
    coordinates: Coordinates[];
    distance: number;
    duration: number;
}

interface LocationInfo {
    address: string;
    coordinates: Coordinates;
}

export const routeService = {
    async calculateRoute(origin: Coordinates, destination: Coordinates): Promise<RouteInfo> {
        const response = await api.post('/routes/calculate', {
            origin,
            destination
        });
        return response.data;
    },

    async getLocationInfo(latitude: number, longitude: number): Promise<LocationInfo> {
        const response = await api.get('/routes/location', {
            params: {
                latitude,
                longitude
            }
        });
        return response.data;
    }
}; 
import { IPlace } from './model';
import places from './schema';
import { FilterQuery, Types } from 'mongoose';

export default class PostService {
    
    public async createPlace(post_params: IPlace): Promise<IPlace> {
        try {
            const session = new places(post_params);
            return await session.save();
        } catch (error) {
            throw error;
        }
    }

    public async filterOnePlace(query: any): Promise<IPlace | null> {
        try {
            return await places.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async filterPlaces(query: any, page: number, pageSize: number): Promise<IPlace[] | null> {
        try {
            const skipCount = (page - 1) * pageSize;
            const updatedQuery = { ...query, place_deactivated: { $ne: true } };
            return await places.find(updatedQuery).skip(skipCount).limit(pageSize);
        } catch (error) {
            throw error;
        }
    }
    
    public async filterPlacesEvenDeactivated(query: any, page: number, pageSize: number): Promise<IPlace[] | null> {
        try {
            const skipCount = (page - 1) * pageSize;
            const updatedQuery = { query };
            return await places.find(updatedQuery).skip(skipCount).limit(pageSize);
        } catch (error) {
            throw error;
        }
    }

    public async updatePlace(place_params: IPlace): Promise<void> {
        try {
            const query = { _id: place_params._id };
            await places.findOneAndUpdate(query, place_params);
        } catch (error) {
            throw error;
        }
    }

    public async deactivatePlace(place_paramsPartial: Partial<IPlace>, place_filter: FilterQuery<IPlace>): Promise<void> {
        try {
            await places.findOneAndUpdate(place_filter, place_paramsPartial);
        } catch (error) {
            throw error;
        }
    }

    public async addReviewToPlace(placeId: Types.ObjectId, reviewId: Types.ObjectId): Promise<void> {
        try {
            // Retrieve the user document by ID
            const place = await places.findById(placeId);
            if (!place) {
                throw new Error('User not found');
            }

            // Add the post ID to the user's array of posts
            place.reviews.push(reviewId);

            // Save the updated user document
            await place.save();
        } catch (error) {
            throw error;
        }
    }

    public async findNearbyBankito (longitude: number, latitude: number, maxDistanceKm:number): Promise<(IPlace & { distance: number })[]>{
        
        const maxDistanceMeters = maxDistanceKm * 1000;

        try {
            const bankito: (IPlace & { distance?: number })[] = await places.find({
                'typeOfPlace.bankito': true, // Filtro para "bankitos"
                coords: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: maxDistanceMeters
                    }
                }
            }).lean().exec();

            return bankito.map(places => {
                const distance = this.calculateDistance([longitude, latitude], places.coords.coordinates);
                return { ...places, distance };
            });
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private calculateDistance (coords1: [number, number], coords2: [number, number]): number {
        const [lon1, lat1] = coords1;
        const [lon2, lat2] = coords2;

        const R = 6371; // Radio de la Tierra en km
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distancia en km

        return distance;
    }

    private degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
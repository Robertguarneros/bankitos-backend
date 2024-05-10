import { Request, Response } from 'express';
import { IHousing } from '../modules/housing/model';
import UserService from '../modules/users/service';
import HousingService from '../modules/housing/service';
import * as mongoose from 'mongoose';

export class HousingController {

  private housing_service: HousingService = new HousingService();
  private user_service: UserService = new UserService();

  public async create_house(req: Request, res: Response) {
    try {
      // this check whether all the fields were sent through the request or not
      if (
        req.body.title &&
        req.body.description &&
        req.body.owner &&
        req.body.rating &&
        req.body.coords && // corrected here
        req.body.photo &&
        req.body.address &&
        req.body.availability &&
        req.body.coffee &&
        req.body.schedule &&
        req.body.verified
      ) {
        const house_params: IHousing = {
          title: req.body.title,
          description: req.body.description,
          owner: req.body.owner,
          rating: req.body.rating,
          coords:{
            latitude: req.body.coords.latitude,
            longitude: req.body.coords.longitude,
          },
          photo: req.body.photo,
          address: req.body.address,
          availability: req.body.availability,
          coffee: req.body.coffee,
          schedule: {
            monday: req.body.schedule.monday,
            tuesday: req.body.schedule.tuesday,
            wednesday: req.body.schedule.wednesday,
            thursday: req.body.schedule.thursday,
            friday: req.body.schedule.friday,
            saturday: req.body.schedule.saturday,
            sunday: req.body.schedule.sunday,
          },
          verified: req.body.verified,
          house_deactivated: false,
          creation_date: new Date(),
          modified_date: new Date(),
        };

        const house_data = await this.housing_service.createHouse(house_params);
        console.log(house_data);
        // Now, you may want to add the created post's ID to the user's array of posts
        await this.user_service.addHousingOfferedToUser(req.body.owner, house_data._id);
        return res.status(201).json(house_data);
      } else {
        return res.status(400).json({ error: 'Missing fields' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
}

  public async get_house(req: Request, res: Response) {
    try{
        if (req.params.id) {
            const house_filter = { _id: req.params.id };
            // Fetch user
            const house_data = await this.housing_service.filterOneHouse(house_filter);
            if(house_data.house_deactivated===true){
                return res.status(400).json({ error: 'House not found' });
            }
            // Send success response
            return res.status(200).json(house_data);
        } else {
            return res.status(400).json({ error: 'Missing fields' });
        }
    }catch(error){
        return res.status(500).json({ error: 'Internal server error' });
    }
}

  public async get_housing(req: Request, res: Response) {
    try {
        // Extract pagination parameters from query string or use default values
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

        // Fetch users based on pagination parameters
        const house_data = await this.housing_service.filterHousing({}, page, pageSize);

        // Send success response
        return res.status(200).json(house_data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

public async get_housing_even_deactivated(req: Request, res: Response) {
    try {
        // Extract pagination parameters from query string or use default values
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

        // Fetch users based on pagination parameters
        const house_data = await this.housing_service.filterHousingEvenDeactivated({}, page, pageSize);

        // Send success response
        return res.status(200).json(house_data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

public async update_house(req: Request, res: Response) {
    try {
        if (req.params.id) {
            const house_filter = { _id: req.params.id };
            // Fetch user
            const house_data = await this.housing_service.filterOneHouse(house_filter);
            if(house_data.house_deactivated===true){
                return res.status(400).json({ error: 'House not found' });
            }
            const objectid = new mongoose.Types.ObjectId(req.params.id);
            
            const house_params: IHousing = {
                _id: objectid, 
                title: req.body.title || house_data.title,
                description: req.body.description || house_data.description,
                owner: req.body.owner || house_data.owner,
                rating: req.body.rating || house_data.rating,
                reviews: req.body.reviews || house_data.reviews,
                coords:{
                    latitude: req.body.coords.latitude || house_data.coords.latitude,
                    longitude: req.body.coords.longitude || house_data.coords.longitude,
                },
                photo: req.body.photo || house_data.photo,
                address: req.body.address || house_data.address,
                availability: req.body.availability || house_data.availability,
                coffee: req.body.coffee || house_data.coffee,
                schedule: {
                    monday: req.body.schedule.monday || house_data.schedule.monday,
                    tuesday: req.body.schedule.tuesday || house_data.schedule.tuesday,
                    wednesday: req.body.schedule.wednesday || house_data.schedule.wednesday,
                    thursday: req.body.schedule.thursday || house_data.schedule.thursday,
                    friday: req.body.schedule.friday || house_data.schedule.friday,
                    saturday: req.body.schedule.saturday || house_data.schedule.saturday,
                    sunday: req.body.schedule.sunday || house_data.schedule.sunday,
                },
                verified: req.body.verified || house_data.verified,
                house_deactivated: house_data.house_deactivated,
                creation_date: house_data.creation_date,
                modified_date: new Date(),
            };
            // Update user
            await this.housing_service.updateHousing(house_params);
            //get new user data
            const new_housing_data = await this.housing_service.filterOneHouse(house_filter);
            // Send success response
            return res.status(200).json(new_housing_data);
        } else {
            // Send error response if ID parameter is missing
            return res.status(400).json({ error: 'Missing ID parameter' });
        }
    } catch (error) {
        // Catch and handle any errors
        console.error("Error updating:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

public async deactivate_house(req: Request, res: Response) {
    try {
        if (req.params.id) {
            const house_filter = { _id: req.params.id };
            // Fetch user
            const house_data = await this.housing_service.filterOneHouse(house_filter);
            if(house_data.house_deactivated===true){
                return res.status(400).json({ error: 'User not found' });
            }
            // Create a partial user object with only the user_deactivated field updated
        const house_paramsPartial: Partial<IHousing> = {
            house_deactivated: true,
            modified_date: new Date(),
        };

        // Update user
        await this.housing_service.deactivateHouse(house_paramsPartial, house_filter);

        const new_housing_data = await this.housing_service.filterOneHouse(house_filter);
        // Send success response
        if (new_housing_data.house_deactivated === true) {
            return res.status(200).json({ message: 'House Deleted' });
        }
    } else {
        // Send error response if ID parameter is missing
        return res.status(400).json({ error: 'Missing ID parameter' });
    }
} catch (error) {
    // Catch and handle any errors
    console.error("Error updating:", error);
    return res.status(500).json({ error: 'Internal server error' });
}
}

}
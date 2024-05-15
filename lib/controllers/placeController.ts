import { Request, Response } from 'express';
import { IPlace } from '../modules/places/model';
import PlaceService from '../modules/places/service';
import UserService from '../modules/users/service';
import * as mongoose from 'mongoose';

export class PlaceController {

  private place_service: PlaceService = new PlaceService();
  private user_service: UserService = new UserService();

  public async create_place(req: Request, res: Response) {
      try {
        // this check whether all the fields were sent through the request or not
        if (
          req.body.title &&
          req.body.content &&
          req.body.author &&
          req.body.rating &&
          req.body.coords &&
          req.body.photo &&
          req.body.typeOfPlace &&
          req.body.schedule &&
          req.body.address
        ) {
          const place_params: IPlace = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            rating: req.body.rating,
            coords:{
              latitude: req.body.coords.latitude,
              longitude: req.body.coords.longitude,
            },
            photo: req.body.photo,
            typeOfPlace: {
              bankito: req.body.typeOfPlace.bankito,
              public: req.body.typeOfPlace.public,
              covered: req.body.typeOfPlace.covered,
            },
            schedule: {
              monday: req.body.schedule.monday,
              tuesday: req.body.schedule.tuesday,
              wednesday: req.body.schedule.wednesday,
              thursday: req.body.schedule.thursday,
              friday: req.body.schedule.friday,
              saturday: req.body.schedule.saturday,
              sunday: req.body.schedule.sunday,
            },
            address: req.body.address,
            place_deactivated: false,
            creation_date: new Date(),
            modified_date: new Date(),
          };
          console.log("Place data")
          const place_data = await this.place_service.createPlace(place_params);
          // Now, you may want to add the created post's ID to the user's array of posts
          console.log("place data realizado")
          await this.user_service.addPlaceToUser(req.body.author, place_data._id);
          console.log("añadido place a user")
          return res.status(201).json(place_data);
        } else {
            console.log("missing fields")
          return res.status(400).json({ error: 'Missing fields' });
        }
      } catch (error) {
        console.log("Error: "+error)
        return res.status(500).json({ error: 'Internal server error' });
      }
  }

  public async get_place(req: Request, res: Response) {
      try{
          if (req.params.id) {
              const place_filter = { _id: req.params.id };
              // Fetch user
              const place_data = await this.place_service.filterOnePlace(place_filter);
              // Send success response
              return res.status(200).json(place_data);
          } else {
              return res.status(400).json({ error: 'Missing fields' });
          }
      }catch(error){
          return res.status(500).json({ error: 'Internal server error' });
      }
  }
  
  public async get_places(req: Request, res: Response) {
    try {
        // Extract pagination parameters from query string or use default values
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

        // Fetch users based on pagination parameters
        const place_data = await this.place_service.filterPlaces({}, page, pageSize);

        // Send success response
        return res.status(200).json(place_data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
  public async get_places_by_user(req: Request, res: Response) {
    try {
        // Extract pagination parameters from query string or use default values
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
        const place_filter = { author: req.params.id };

        // Fetch users based on pagination parameters
        const place_data = await this.place_service.filterPlaces(place_filter, page, pageSize);

        // Send success response
        return res.status(200).json(place_data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async get_places_even_deactivated(req: Request, res: Response) {
      try {
          // Extract pagination parameters from query string or use default values
          const page = req.query.page ? parseInt(req.query.page as string) : 1;
          const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
  
          // Fetch users based on pagination parameters
          const place_data = await this.place_service.filterPlacesEvenDeactivated({}, page, pageSize);
  
          // Send success response
          return res.status(200).json(place_data);
      } catch (error) {
          return res.status(500).json({ error: 'Internal server error' });
      }
  }
  
  public async update_place(req: Request, res: Response) {
      try {
          if (req.params.id) {
            console.log("Estoy aqui 1")
              const place_filter = { _id: req.params.id };
              // Fetch user
              const place_data = await this.place_service.filterOnePlace(place_filter);
              if(place_data.place_deactivated===true){
                  return res.status(400).json({ error: 'Place not found' });
              }
              console.log("Estoy aqui 2")

              const objectid = new mongoose.Types.ObjectId(req.params.id);
              console.log("Estoy aqui 3")

              // Check if emergency_contact exists in req.body and handle accordingly
              const place_params: IPlace = {
                  _id: objectid,
                  title: req.body.title || place_data.title,
                  content: req.body.content || place_data.content,
                  author: req.body.author || place_data.author,
                  rating: req.body.rating || place_data.rating,
                  coords: {
                      latitude: req.body.coords.latitude || place_data.coords.latitude,
                      longitude: req.body.coords.longitude || place_data.coords.longitude,
                  },
                  photo: req.body.photo || place_data.photo,
                  typeOfPlace: {
                      bankito: req.body.typeOfPlace.bankito || place_data.typeOfPlace.bankito,
                      public: req.body.typeOfPlace.public || place_data.typeOfPlace.public,
                      covered: req.body.typeOfPlace.covered || place_data.typeOfPlace.covered,
                  },
                  schedule: {
                      monday: req.body.schedule.monday || place_data.schedule.monday,
                      tuesday: req.body.schedule.tuesday || place_data.schedule.tuesday,
                      wednesday: req.body.schedule.wednesday || place_data.schedule.wednesday,
                      thursday: req.body.schedule.thursday || place_data.schedule.thursday,
                      friday: req.body.schedule.friday || place_data.schedule.friday,
                      saturday: req.body.schedule.saturday || place_data.schedule.saturday,
                      sunday: req.body.schedule.sunday || place_data.schedule.sunday,
                  },
                  address: req.body.address || place_data.address,
                  place_deactivated: place_data.place_deactivated,
                  creation_date: place_data.creation_date,
                  modified_date: new Date(),
              };
              // Update user
              console.log("Estoy aqui 4")

              await this.place_service.updatePlace(place_params);
              //get new user data
              console.log("Estoy aqui 5")

              const new_place_data = await this.place_service.filterOnePlace(place_filter);
              console.log("Estoy aqui 6")

              // Send success response
              return res.status(200).json(new_place_data);
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

  public async deactivate_place(req: Request, res: Response) {
      try {
          if (req.params.id) {
              const place_filter = { _id: req.params.id };
              // Fetch user
              const place_data = await this.place_service.filterOnePlace(place_filter);
              if(place_data.place_deactivated===true){
                  return res.status(400).json({ error: 'Place not found' });
              }
              // Create a partial user object with only the user_deactivated field updated
          const place_paramsPartial: Partial<IPlace> = {
              place_deactivated: true,
              modified_date: new Date(),
          };

          // Update user
          await this.place_service.deactivatePlace(place_paramsPartial, place_filter);

          const new_palce_data = await this.place_service.filterOnePlace(place_filter);
          // Send success response
          if (new_palce_data.place_deactivated === true) {
              return res.status(200).json({ message: 'Place Deleted' });
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
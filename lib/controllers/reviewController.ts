import { Request, Response } from 'express';
import { IReview } from '../modules/reviews/model';
import ReviewService from '../modules/reviews/service';
import UserService from '../modules/users/service';
import * as mongoose from 'mongoose';
import IJwtPayload from '../modules/JWTPayload';

export class ReviewController {

    private review_service: ReviewService = new ReviewService();
    private user_service: UserService = new UserService();

    public async create_review(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.title && req.body.content && req.body.stars    ){
               
                console.log('dentro crear'+req.userId);
                const review_params:IReview = {
                    title: req.body.title,
                    content: req.body.content,
                    stars: req.body.stars,
                    author: req.userId,
                    place_id: req.body.place_id || null,
                    housing_id: req.body.housing_id || null,
                    review_deactivated: req.body.review_deactivated || false,
                    creation_date: new Date(),
                    modified_date: new Date(),
                };
                const review_data = await this.review_service.createReview(review_params);
                 //add to user
                await this.user_service.addReviewToUser(req.userId, review_data._id); //
                return res.status(201).json(review_data);
            }
            else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async get_review_by_id_even_deactivated(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const review_filter = { _id: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviewByID(review_filter);
                // Send success response
                return res.status(200).json(review_data);
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async get_review_by_id(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const review_filter = { author: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviews(review_filter);
                console.log(review_data);
                // Send success response
                return res.status(200).json(review_data);
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async get_reviews_by_author(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const review_filter = { author: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviewsByAuthor(review_filter);
                // Send success response
                return res.status(200).json(review_data);
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async get_reviews_by_place(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const review_filter = { place_id: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviewsByPlace(review_filter);
                // Send success response
                return res.status(200).json(review_data);
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async get_reviews_by_housing(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const review_filter = { housing_id: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviewsByHousing(review_filter);
                // Send success response
                return res.status(200).json(review_data);
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async update_review(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const review_filter = { _id: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviewByID(review_filter);
                if(review_data.review_deactivated===true){
                    return res.status(400).json({ error: 'Review not found' });
                }
                const objectid = new mongoose.Types.ObjectId(req.params.id);
                
                const review_params: IReview = {
                    _id: objectid, 
                    title: req.body.title || review_data.title,
                    content: req.body.content || review_data.content,
                    stars: req.body.stars || review_data.stars,
                    author: req.body.author || review_data.author,
                    place_id: req.body.place_id || review_data.place_id,
                    housing_id: req.body.housing_id || review_data.housing_id,
                    review_deactivated: review_data.review_deactivated,
                    creation_date: review_data.creation_date,
                    modified_date: new Date(),
                };
                // Update user
                await this.review_service.updateReview(review_params);
                //get new user data
                const new_review_data = await this.review_service.filterReviewByID(review_filter);
                // Send success response
                return res.status(200).json(new_review_data);
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

    public async delete_review(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const review_filter = { _id: req.params.id };
                // Fetch user
                const review_data = await this.review_service.filterReviewByID(review_filter);
                if(review_data.review_deactivated===true){
                    return res.status(400).json({ error: 'Review not found' });
                }
                // Create a partial user object with only the user_deactivated field updated
            const review_paramsPartial: Partial<IReview> = {
                review_deactivated: true,
                modified_date: new Date(),
            };

            // Update user
            await this.review_service.deleteReview(review_paramsPartial, review_filter);

            const new_review_data = await this.review_service.filterReviewByID(review_filter);
            // Send success response
            if (new_review_data.review_deactivated === true) {
                return res.status(200).json({ message: 'Review Deleted' });
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
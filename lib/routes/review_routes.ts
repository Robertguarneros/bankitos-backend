import { Application, Request, Response, NextFunction } from 'express';
import { ReviewController } from '../controllers/reviewController';
import  {authJWT}  from '../middlewares/authJWT';


export class ReviewRoutes {

    private review_controller: ReviewController = new ReviewController();
    private AuthJWT: authJWT = new authJWT();


    public route(app: Application) {
        
        app.post('/review', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                console.log('Dentro de route' + req.body.place_id);
                this.review_controller.create_review(req, res);
            });
        });

        app.get('/review/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.review_controller.get_review_by_id(req, res);
            });
        });

        app.get('/review/admin/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.AuthJWT.isAdmin(req, res, (err?: any) => {
                    if (err) {
                        return next(err); // Short-circuit if isAdmin check fails
                    }
                    this.review_controller.get_review_by_id(req, res);
                });
            });
        });

        app.get('/review/byAuthor/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.review_controller.get_reviews_by_author(req, res);
            });
        });

        app.get('/review/byPlace/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.review_controller.get_reviews_by_place(req, res);
            });
        });

        app.get('/review/byHousing/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.review_controller.get_reviews_by_housing(req, res);
            });
        });

        // Update review by ID
        app.put('/review/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.AuthJWT.isOwner(req, res, (err?: any) => {
                    if (err) {
                        return next(err); // Short-circuit if isOwner check fails
                    }
                    this.review_controller.update_review(req, res);
                }, 'Review');
            });
        });

        // Delete review by ID
        app.delete('/review/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.AuthJWT.isOwner(req, res, (err?: any) => {
                    if (err) {
                        return next(err); // Short-circuit if isOwner check fails
                    }
                    this.review_controller.delete_review(req, res);
                }, 'Review');
            });
        });

    }
}
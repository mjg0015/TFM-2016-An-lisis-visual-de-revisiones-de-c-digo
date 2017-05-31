import * as express from "express";
import { IPullRequestController } from "../controllers/PullRequestController";

/**
 * Pull Request express Routes.
 * Defines our API routes.
 * @author Mario Juez <mario@mjuez.com>
 */
export class PullRequestRoutes {

    /** Pull Request controller. */
    private readonly _controller: IPullRequestController;

    /** Express Router. */
    private readonly _router: express.Router;

    /**
     * Class constructor. Injects controller and router dependencies.
     * @param controller    Pull Request controller.
     * @param router        A express router.
     */
    constructor(controller: IPullRequestController, router: express.Router) {
        this._controller = controller;
        this._router = router;
    }

    /**
     * Gets Pull Request API routes.
     * @returns  the router.
     */
    public get routes(): express.Router {
        let router: express.Router = this._router;
        let controller: IPullRequestController = this._controller;

        router.get("/pull/:owner/:repository/:number", (req: express.Request, res: express.Response) => {
            controller.get(req, res);
        });

        router.get("/pulls", (req: express.Request, res: express.Response) => {
            req.params.page = 1;
            req.params.direction = 'ASC';
            controller.getPage(req, res);
        });

        router.get("/pulls/page/:page", (req: express.Request, res: express.Response) => {
            req.params.direction = 'ASC';
            controller.getPage(req, res);
        });

        router.get("/pulls/page/:page/order/date/:direction", (req: express.Request, res: express.Response) => {
            controller.getPage(req, res);
        });

        router.get("/pulls/page/:page/order/name/:direction", (req: express.Request, res: express.Response) => {
            controller.getByNamePage(req, res);
        });

        router.get("/pulls/page/:page/order/reviews/:direction", (req: express.Request, res: express.Response) => {
            controller.getByReviewsPage(req, res);
        });

        router.get("/pulls/single/:owner/:repository", (req: express.Request, res: express.Response) => {
            req.params.page = 1;
            req.params.direction = 'ASC';
            controller.getPageFromRepository(req, res);
        });

        router.get("/pulls/single/:owner/:repository/page/:page", (req: express.Request, res: express.Response) => {
            req.params.direction = 'ASC';
            controller.getPageFromRepository(req, res);
        });

        router.get("/pulls/single/:owner/:repository/page/:page/order/date/:direction", (req: express.Request, res: express.Response) => {
            controller.getPageFromRepository(req, res);
        });

        router.get("/pulls/single/:owner/:repository/page/:page/order/name/:direction", (req: express.Request, res: express.Response) => {
            controller.getByNamePageFromRepository(req, res);
        });

        router.get("/pulls/single/:owner/:repository/page/:page/order/reviews/:direction", (req: express.Request, res: express.Response) => {
            controller.getByReviewsPageFromRepository(req, res);
        });

        router.get("/:owner/:repository/pulls/stats/created/alltime", (req: express.Request, res: express.Response) => {
            controller.getCreatedAllTime(req, res);
        });

        return router;
    }

}
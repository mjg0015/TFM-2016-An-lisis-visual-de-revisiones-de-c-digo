import { ITask } from "./ITask";
import { GitHubTask } from "./GitHubTask";
import { IReviewEntity, ReviewEntity } from "../../entities/ReviewEntity";
import { ITaskEntity } from "../../entities/TaskEntity";
import { IPullRequestEntity } from "../../entities/PullRequestEntity";
import { ITaskRepository } from "../../data/TaskRepository";
import { IPullRequestRepository } from "../../data/PullRequestRepository";
import { IReviewRepository } from "../../data/ReviewRepository";
import { IReviewService } from "../../services/ReviewService";
import {
    RepositoryPullRequestFilter,
    PullRequestFilterFactory
} from "../../data/filters/PullRequestFilter";
import { GitHubUtil } from "../../util/GitHubUtil";
import * as GitHubAPI from "github";

interface Repositories {
    pull: IPullRequestRepository,
    task: ITaskRepository,
    review: IReviewRepository
}

export interface IReviewsTask extends ITask { }

export class ReviewsTask extends GitHubTask implements IReviewsTask {

    private readonly _repositories: Repositories;

    private readonly _reviewService: IReviewService;

    constructor(repos: Repositories, reviewService: IReviewService, api?: GitHubAPI, apiAuth?: GitHubAPI.Auth) {
        super(repos.task, api, apiAuth);
        this._repositories = repos;
        this._reviewService = reviewService;
    }

    public async run(): Promise<void> {
        const pullRepo: IPullRequestRepository = this._repositories.pull;
        const filter: RepositoryPullRequestFilter =
            PullRequestFilterFactory.createRepository({ owner: this.entity.owner, repository: this.entity.repository });
        const startingFrom: number = this.entity.lastProcessed;
        try {
            console.log("Starting reviews task...");
            await this.startTask();
            const numPages: number = await pullRepo.numPages(filter, startingFrom);
            for (let page: number = 1; page <= numPages; page++) {
                const pulls: IPullRequestEntity[] = await pullRepo.retrieve({ filter, page, startingFrom });
                const success: boolean = await this.processPullRequests(pulls);
                if (!success) return;
            }
            await this.completeTask();
        } catch (error) {
            this.emit("db:error", error);
        }
    }

    private async processPullRequests(pulls: IPullRequestEntity[]): Promise<boolean> {
        for (let i: number = 0; i < pulls.length; i++) {
            let pull: IPullRequestEntity = pulls[i];
            try {
                await this.makeApiCall(pull.document.number);
                await this.updateStats(pull);
                this.entity.lastProcessed = pull.document.number;
                this.entity.currentPage = 1;
                await this.persist();
            } catch (error) {
                return false;
            }
        }
        return true;
    }

    private async makeApiCall(pullNumber: number): Promise<void> {
        try {
            let page: any = await this.API.pullRequests.getReviews(<GitHubAPI.PullRequestsGetReviewsParams>{
                owner: this.entity.owner,
                repo: this.entity.repository,
                number: pullNumber,
                per_page: 100,
                direction: `asc`,
                page: this.entity.currentPage
            });
            await this.processPage(page);
        } catch (error) {
            this.emitError(error);
            throw error;
        }
    }

    private async processPage(page: any): Promise<void> {
        let api: GitHubAPI = this.API;
        let reviews: IReviewEntity[] = ReviewEntity.toEntityArray(page.data);
        console.log(`[${new Date()}] - Getting reviews page ${this.entity.currentPage}, remaining reqs: ${page.meta['x-ratelimit-remaining']}`);
        try {
            await this._reviewService.createOrUpdateMultiple(reviews);
            if (api.hasNextPage(page)) {
                let links: string = page.meta.link;
                let nextPageNumber: number = GitHubUtil.getNextPageNumber(links);
                console.log(`links: ${links}, pagenumber: ${nextPageNumber}`);
                this.entity.currentPage = nextPageNumber;
                await this.persist();
                let nextPage: any = await api.getNextPage(page);
                await this.processPage(nextPage);
            }
        } catch (error) {
            throw error;
        }
    }

    private async updateStats(pull: IPullRequestEntity): Promise<void> {
        let pullRepo: IPullRequestRepository = this._repositories.pull;
        let reviewRepo: IReviewRepository = this._repositories.review;
        let filter: Object = {
            pull_request_number: pull.document.number,
            repository: {
                name: pull.document.base.repo.name,
                owner: pull.document.base.repo.owner.login
            }
        }
        try {
            let reviewsCount: number = await reviewRepo.count(filter);
            console.log(`Updating pull reviews count, pull: #${pull.document.number} (${pull.document.base.repo.owner.login}/${pull.document.base.repo.name}, count: ${reviewsCount})`);
            pull.document["reviews"] = reviewsCount;
            await pullRepo.update(pull);
        } catch (error) {
            this.emit("db:error", error);
            throw error;
        }
    }
}
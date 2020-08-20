import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { ApiPath, ApiOperationGet } from "swagger-express-ts";
import { inject } from "inversify";

import BaseController from "../base.controller";
import {checkAuthenticated} from "../../middlewares/auth.handler";
import TrainingRepository from "../../repositories/training.repository";
import ShotRepository from "../../repositories/shot.repository";
import RoundRepository from "../../repositories/round.repository";
import {StatsModel} from "../../models/stats.models";
import User from "../../entities/user.entity";
import UserRepository from "../../repositories/user.repository";
import {RankingModel} from "../../models/rankings.models";

@ApiPath({
    path: "/ranking",
    name: "Ranking"
})
@controller("/api/ranking", checkAuthenticated)
export default class RankingController extends BaseController
{
    constructor(
        @inject(UserRepository) private _userRepository: UserRepository,
        @inject(RoundRepository) private _roundRepository: RoundRepository
    ) {
        super();
    }

    @ApiOperationGet({
        path: "/experience",
        summary: "Get experience ranking",
        responses: {
            200: { model: RankingModel.NAME }
        }
    })
    @httpGet("/experience")
    public async getExperienceRankingList(req: Request, res: Response)
    {
        return res.json(await this._userRepository.getAchievementRankingList());
    }

    @ApiOperationGet({
        path: "/accuracy",
        summary: "Get accuracy ranking",
        responses: {
            200: { model: RankingModel.NAME }
        }
    })
    @httpGet("/accuracy")
    public async getAccuracyRankingList(req: Request, res: Response)
    {
        console.log(await this._roundRepository.getAccuracyRanking())
        return res.json(await this._roundRepository.getAccuracyRanking());
    }
}



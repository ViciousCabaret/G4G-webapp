import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { ApiPath, ApiOperationGet } from "swagger-express-ts";
import { inject } from "inversify";

import BaseController from "../base.controller";
import TrainingRepository from "../../repositories/training.repository";
import ShotRepository from "../../repositories/shot.repository";
import WeaponRepository from "../../repositories/weapon.repository";
import Weapon from "../../entities/weapon.entity";
import { StatsModel } from "../../models/stats.models";
import User from "../../entities/user.entity";
import RoundRepository from "../../repositories/round.repository";
import {checkAuthenticated} from "../../middlewares/auth.handler";
import {Debugger} from "inspector";

@ApiPath({
	path: "/stats",
	name: "Stats"
})
@controller("/api/stats", checkAuthenticated)
export default class StatsController extends BaseController {
	constructor(
		@inject(TrainingRepository) private _trainingRepository: TrainingRepository,
		@inject(ShotRepository) private _shotRepository: ShotRepository,
		@inject(RoundRepository) private _roundRepository: RoundRepository
		) {
        super();
    }
	@ApiOperationGet({
		path: "/",
		summary: "Get stats",
		responses: {
			200: { model: StatsModel.NAME }
		}
	})
	@httpGet("/")
	public async list(req: Request, res: Response) {
		const user = req.user as User;

		res.json(await this.getStatsModel(user));
	}

	private async getStatsModel(user: User)
	{
		const trainingsCount = await this._trainingRepository.countByUser(user)
		const shotsCount = await this._shotRepository.countByUser(user)
		const accuracyAvg = await this._roundRepository.getAccuracyAvgByUser(user)
		const pointsSum = await this._roundRepository.getPointsSumByUser(user)

		return {
			'trainingsCount': trainingsCount,
			'shotsCount': shotsCount,
			'accuracyAverageAmount': accuracyAvg,
			'pointsSum': pointsSum
		}
	}
}

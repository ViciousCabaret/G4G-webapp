import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Round from "../entities/round.entity";
import {fchmod} from "fs";
import User from "../entities/user.entity";

@injectable()
export default class RoundRepository extends BaseRepository<Round> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Round);
	}

	public async findByUser(user: User): Promise<Round[]>
	{
		return await this.repository
			.createQueryBuilder('r')
			.where('t.user = :user', {user: user.id})
			.leftJoin('r.training', 't')
			.getMany()
	}

	public async countByUser(user: User): Promise<number>
	{
		return await this.repository
			.createQueryBuilder('r')
			.where('t.user = :user', {user: user.id})
			.leftJoin('r.training', 't')
			.getCount()
	}

	public async getAccuracyAvgByUser(user: User): Promise<number>
	{
		const avgObject = await this.repository
			.createQueryBuilder('r')
			.select('truncate(avg(r.accuracy), 1)', 'avg')
			.where('t.user = :user', {user: user.id})
			.leftJoin('r.training', 't')
			.getRawOne();

		return avgObject.avg;
	}

	public async getPointsSumByUser(user: User): Promise<number>
	{
		const avgObject = await this.repository
			.createQueryBuilder('r')
			.select('sum(r.points)', 'overallSum')
			.where('t.user = :user', {user: user.id})
			.leftJoin('r.training', 't')
			.getRawOne();

		return avgObject.overallSum;
	}

	public async getAccuracyRanking(limit: number = 5)
	{
		return this.repository
			.createQueryBuilder('r')
			.select('u.username', 'username')
			.addSelect('avg(r.accuracy)', 'score')
			.leftJoin('r.training', 't')
			.leftJoin('t.user', 'u')
			.groupBy('u.id')
			.orderBy('score', 'DESC')
			.limit(limit)
			.getRawMany()
	}
}

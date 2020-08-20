import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Shot from "../entities/shot.entity";
import User from "../entities/user.entity";

@injectable()
export default class ShotRepository extends BaseRepository<Shot> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Shot);
	}

	public async findByUser(user: User): Promise<Shot[]> {
		return await this.repository
			.createQueryBuilder("s")
			.select('s')
			.where("t.user = :user", { user: user.id })
			.leftJoin('s.round', 'r')
			.leftJoin('r.training', 't')
			.getMany()
	}

	public async countByUser(user: User): Promise<number> {
		return await this.repository
			.createQueryBuilder("s")
			.select('s')
			.where("t.user = :user", { user: user.id })
			.leftJoin('s.round', 'r')
			.leftJoin('r.training', 't')
			.getCount();
	}
}

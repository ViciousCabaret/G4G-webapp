import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Training from "../entities/training.entity";
import User from "../entities/user.entity";

@injectable()
export default class TrainingRepository extends BaseRepository<Training> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Training);
	}

    public async findByUser(user: User): Promise<Training[]> {
        return await this.repository
            .createQueryBuilder("t")
			.select("t")
            .where("t.user = :user", { user: user.id })
            .getMany();
    }

    public async countByUser(user: User): Promise<number> {
        return await this.repository
            .createQueryBuilder("t")
			.select("t")
            .where("t.user = :user", { user: user.id })
            .getCount();
    }
}

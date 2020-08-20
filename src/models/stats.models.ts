import { ApiModel } from "swagger-express-ts";
import { ApiModelProperty } from "../constants/decorators";
import { BaseModel } from "./base.model";
import { IsInt } from "class-validator";
import { UserModel } from "./user.models";

@ApiModel({
	name: StatsModel.NAME
})
export class StatsModel extends BaseModel<StatsModel> {
    public static readonly NAME = "StatsModel";

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	trainingsCount: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	shotsCount: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	accuracyAverageAmount: number;
	//
	// @ApiModelProperty({
	// 	required: true,
	// 	type: "integer"
	// })
    // avgPrecision: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	overallScoreSum: number;
}

// @ApiModel({
// 	name: RankingModel.NAME
// })
// export class RankingModel extends BaseModel<RankingModel> {
//     public static readonly NAME = "RankingModel";
//
// 	@ApiModelProperty({
// 		required: true,
// 		type: "integer"
// 	})
//     position: number;
//
// 	@ApiModelProperty({
// 		required: true,
// 		type: "integer"
// 	})
//     value: number;
//
// 	@ApiModelProperty({
// 		required: true,
//         model: UserModel.NAME
// 	})
//     user: UserModel;
// }
import { ApiModel } from "swagger-express-ts";
import { ApiModelProperty } from "../constants/decorators";
import { BaseModel } from "./base.model";
import { UserModel } from "./user.models";

@ApiModel({
    name: RankingModel.NAME
})
export class RankingModel extends BaseModel<RankingModel>
{
    public static readonly NAME = "RankingModel";

    @ApiModelProperty({
        required: true,
        type: 'string'
    })
    username: string;

    @ApiModelProperty({
        required: true,
        type: "integer"
    })
    score: number;

}
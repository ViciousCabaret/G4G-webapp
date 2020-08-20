import { inject } from "inversify";
import { Request, Response } from "express";
import { controller, httpGet, httpPost, httpPut, queryParam, request, response } from "inversify-express-utils";
import { ApiPath, ApiOperationGet, ApiOperationPost, ApiOperationPut } from "swagger-express-ts";
import { validate, ValidationError } from "class-validator";
import sha1 from "sha1";

import BaseController from "../base.controller";
import TrainingRepository from "../../repositories/training.repository";
import Training from "../../entities/training.entity";
import { ValidationException, NotFoundException } from "../../constants/exceptions";
import { TrainingModel, TrainingUpdateModel } from "../../models/training.models";
import Round from "../../entities/round.entity";
import WeaponRepository from "../../repositories/weapon.repository";
import Shot from "../../entities/shot.entity";
import RoundRepository from "../../repositories/round.repository";
import ShotRepository from "../../repositories/shot.repository";
import { checkAuthenticated } from "../../middlewares/auth.handler";
import UserRepository from "../../repositories/user.repository";
import User from "../../entities/user.entity";
import { ProfileUpdateModel, UserModel } from "../../models/user.models";
import { ValidationErrorModel } from "../../models/validation.models";

@ApiPath({
	path: "/users",
	name: "Users"
})
@controller("/api/users")
export default class UserController extends BaseController {
    constructor(@inject(UserRepository) private _userRepository: UserRepository) {
        super();
    }

	@ApiOperationGet({
		path: "/profile",
		summary: "Get profile",
		responses: {
			200: { type: "array", model: User.NAME },
			401: {}
		},
		security: {
			APIKeyHeader: []
		}
	})
	@httpGet("/profile", checkAuthenticated)
	public async getProfile(req: Request, res: Response) {
		const user = req.user as User;
        res.json(await user.toJSON());
	}

	@ApiOperationGet({
		path: "/achievements",
		summary: "Get user achievements",
		responses: {
			200: { type: "array", model: User.NAME },
			401: {}
		},
		security: {
			APIKeyHeader: []
		}
	})
	@httpGet("/achievements", checkAuthenticated)
	public async getUserAchievements(req: Request, res: Response) {
		const user = req.user as User;

	}

	@ApiOperationPut({
		path: "/profile",
		parameters: {
			body: {
				model: ProfileUpdateModel.NAME
			}
		},
		summary: "Update profile",
		responses: {
			200: { model: User.NAME },
			400: { model: ValidationErrorModel.NAME },
			401: {}
		},
		security: {
			APIKeyHeader: []
		}
	})
	@httpPut("/profile", checkAuthenticated)
	public async updateProfile(@request() req: Request, @response() res: Response) {
		const user = req.user as User;
		const data = new ProfileUpdateModel(req.body);

		const errors = await validate(data);
		if(errors.length > 0) {
			throw new ValidationException(errors);
		}

		await this.prepareProfile(data, user);
		await this._userRepository.update(user);
		
        res.json(await user.toJSON());
	}

	private async prepareProfile(model: ProfileUpdateModel, user: User): Promise<User> {
		if (user.username != model.username && await this._userRepository.findOneByUsername(model.username)) {
			const err = new ValidationError();						
			err.property = "username";
			err.constraints = {
				username: "Username is already taken"
			};

			throw new ValidationException([err]);
		}

		if (user.email != model.email && await this._userRepository.findOneByEmail(model.username)) {
			const err = new ValidationError();						
			err.property = "email";
			err.constraints = {
				username: "Email is already taken"
			};

			throw new ValidationException([err]);
		}

		user.update({
			username: model.username,
			email: model.email,
			password: model.password && model.password != "" ? sha1(model.password) : undefined,
			avatar: model.avatar
		});

		return user;
	}

	@ApiOperationPost({
		path: "/",
		parameters: {
			body: {
				model: UserModel.NAME
			}
		},
		summary: "Create user",
		responses: {
			200: { model: User.NAME },
			400: { model: ValidationErrorModel.NAME }
		}
	})
	@httpPost("/")
	public async create(req: Request, res: Response) {
		const data = new UserModel(req.body);

		const errors = await validate(data);

		if(errors.length > 0) {
			throw new ValidationException(errors);
		}

		const user = new User();
		
		await this.prepareUser(data, user);
		
		await this._userRepository.create(user);

        res.json(await user.toJSON());
	}

	private async prepareUser(model: UserModel, user: User): Promise<User> {
		const errs = [];

		if (await this._userRepository.findOneByUsername(model.username)) {
			const err = new ValidationError();						
			err.property = "username";
			err.constraints = {
				username: "Username is already taken"
			};

			errs.push(err);
		}

		if (await this._userRepository.findOneByEmail(model.username)) {
			const err = new ValidationError();						
			err.property = "email";
			err.constraints = {
				username: "Email is already taken"
			};
			
			errs.push(err);
		}

		if (model.password != model.repeatPassword) {
			const err = new ValidationError();						
			err.property = "password";
			err.constraints = {
				username: "The passwords must be identical"
			};

			errs.push(err);
		}
		
		if (errs.length) {
			throw new ValidationException(errs);
		}

		user.build({
			username: model.username,
			email: model.email,
			password: sha1(model.password)
		});

		return user;
	}
}

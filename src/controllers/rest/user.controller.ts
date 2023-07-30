import { Body, Controller, Get, Inject, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IAddUserRequest, IUserService } from 'src/interfaces/iuser';
import { UserService } from 'src/services/user.service';

@Controller("user")
export class UserController {
  private readonly _userService: IUserService;
  constructor(@Inject(UserService) userService: IUserService) {
    this._userService = userService;
  }

  @Get()
  async getAll(@Res() response: Response) {
    const users = await this._userService.getAllAsync();
      response.json(users);
  }

  @Post()
  async add(@Body() request: IAddUserRequest, @Res() response: Response) {
    const user = await this._userService.addAsync(request);
    response.status(201).json(user);
  }
}

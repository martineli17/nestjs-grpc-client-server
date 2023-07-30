import { Controller } from '@nestjs/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { GrpcMethod } from '@nestjs/microservices';
import { IUser, IAddUserRequest, IGetAllUsersRequest, IGetAllUsersResponse } from '../../interfaces/iuser';

@Controller()
export class UserGrpcController {
  private static readonly _users: IUser[] = [];

  constructor() {}

  @GrpcMethod('UserService', 'GetAll')
  GetAll(
    request: IGetAllUsersRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): IGetAllUsersResponse {
    return {
      users: UserGrpcController._users
    }
  }

  @GrpcMethod('UserService', 'Add')
  Add(
    request: IAddUserRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): IUser {
    const lastUser: IUser =
      UserGrpcController._users.length > 0
        ? UserGrpcController._users.reduce((previousUser, user) => {
            const newUser = user.id > previousUser.id ? user : previousUser;
            return newUser;
          })
        : { id: 0, name: '' };

    const newUser: IUser = {
      id: lastUser.id + 1,
      name: request.name,
    };

    UserGrpcController._users.push(newUser);
    return newUser;
  }
}

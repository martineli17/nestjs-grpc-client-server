import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { IUser, IAddUserRequest, IUserGrpcService, IUserService } from "src/interfaces/iuser";

@Injectable()
export class UserService implements OnModuleInit, IUserService {
  private _userGrpcService: IUserGrpcService;
  private _clientGrpc: ClientGrpc;

  constructor(@Inject('grpc_test') client: ClientGrpc) {
    this._clientGrpc = client;
  }

  onModuleInit() {
    this._userGrpcService = this._clientGrpc.getService<IUserGrpcService>('UserService');
  }

  async getAllAsync(): Promise<IUser[]> {
    const response = await firstValueFrom(this._userGrpcService.GetAll({}));
    return response.users;
  }

  async addAsync(request: IAddUserRequest): Promise<IUser> {
    const response = await firstValueFrom(this._userGrpcService.Add(request));
    return response;
  }
}
import { Observable } from "rxjs";

export interface IGetAllUsersRequest {
}

export interface IGetAllUsersResponse {
    users: IUser[];
}

export interface IAddUserRequest {
    name: string;
}

export interface IUser {
    id: number;
    name: string;
}

export interface IUserGrpcService {
    GetAll(request: IGetAllUsersRequest): Observable<IGetAllUsersResponse>;
    Add(request: IAddUserRequest): Observable<IUser>;
}

export interface IUserService {
    getAllAsync(): Promise<IUser[]>;
    addAsync(request: IAddUserRequest): Promise<IUser>;
}
import { Module } from '@nestjs/common';
import { UserGrpcController } from './controllers/grpc/user.grpc-controller';
import { UserController } from './controllers/rest/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'grpc_test',
        transport: Transport.GRPC,
        options: {
          url: "localhost:3001",
          package: 'grpc_test',
          protoPath: './src/protos/user.proto',
        },
      },
    ]),
  ],
  controllers: [UserGrpcController, UserController],
  providers: [UserService],
})
export class AppModule {}

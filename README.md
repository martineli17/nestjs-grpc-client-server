# NestJS - gRPC client e server
Neste exemplo, o objetivo é implementar uma comunicação gRPC entre um servidor e um cliente.

## Pacotes
- [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js)
- [@grpc/proto-loader](https://www.npmjs.com/package/@grpc/proto-loader)
- [@nestjs/microservices](https://www.npmjs.com/package/@nestjs/microservices)

## Servidor
- Para inicializar um servidor gRPC, é necessário informar que a sua aplicação tem um microservice do tipo gRPC.
Com isso, o arquivo de bootstrap da aplicação precisa ser alterado
```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: "localhost:3001", // URL DO SEU SERVIDOR gRPC
      package: 'grpc_test',
      protoPath: './src/protos/user.proto', // ARQUIVO PROTO, PODE SER UM ARRAY CONTENDO MAIS DE UM ARQUIVO
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

- Feita essa alteração, é preciso criar os arquivos .proto que serão responsáveis por representar quais métodos o servidor irá disponibilizar. [Arquivo](https://github.com/martineli17/nestjs-grpc-client-server/blob/master/src/protos/user.proto)

- Com o .proto criado, é necessário criar uma porta para que a comunicação gRPC seja recebida e processada. Para isso, em aplicações NestJS, cria-se um controller para expor essa comunicação. Na controller, cada endpoint representa um método do arquivo .proto. E nestes endpoint, é informado o nome do serviço e o nome do método, que precisam estar iguais ao do arquivo.
```
@GrpcMethod('UserService', 'GetAll')
@GrpcMethod('UserService', 'Add')
```

- Para representar os type utilizados no .proto, pode ser criada interfaces.

## Client
- O registro de um client, o processo pode ser feito via Dependency Injection. Para isso, no module desejado é preciso inserir o import com as informações:
```
imports: [
    ClientsModule.register([
      {
        name: 'grpc_test',
        transport: Transport.GRPC,
        options: {
          url: "localhost:3001", // URL DO SERVIDOR
          package: 'grpc_test',
          protoPath: './src/protos/user.proto', // ARQUIVOS PROTO. TAMBÈM PODE SER UM ARRAY DE ARQUIVOS
        },
      },
    ]),
  ],
```

- Feito o registro via Depedency Injection, agora é possível acessar o cliente de algum service e, assim, realizar a comunicação com o servidor e obter o retorno do mesmo. [Arquivo](https://github.com/martineli17/nestjs-grpc-client-server/blob/master/src/services/user.service.ts)
```
  private _clientGrpc: ClientGrpc;

  // 'grpc_test' é o nome que foi informado no registro feito no module
  constructor(@Inject('grpc_test') client: ClientGrpc) {
    this._clientGrpc = client;
  }
```

- Como pode ter mais um arquivo .proto, é necessário informar qual é o service desejado. Sendo assim, cria-se uma interface para representar o contrato do service e retorna-se ele.
```
// O NOME DO SERVICE PRECISA SER O MESMO INFORMADO NO .proto
this._userGrpcService = this._clientGrpc.getService<IUserGrpcService>('UserService'); 
```

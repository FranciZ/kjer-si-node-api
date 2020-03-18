import { NestFactory, Reflector } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { ValidatorPipe } from './pipes/validator.pipe';
import * as cors from 'cors';
import { RequestExceptionFilter } from './filters/requestException.filter';
import { DefaultExceptionFilter } from './filters/defaultException.filter';
import { RolesGuard } from './guards/roles.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { TeamGuard } from './guards/team.guard';

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

async function bootstrap() {

  const app = await NestFactory.create(ApplicationModule);
  app.use(cors(corsOptions));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new RequestExceptionFilter(), new DefaultExceptionFilter());
  app.useGlobalPipes(new ValidatorPipe());
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalGuards(new TeamGuard(new Reflector()));
  await app.listen(3088, '0.0.0.0');

}

bootstrap();
import { Module } from '@nestjs/common';
import { AuthCommonModule } from '../common/auth/auth.module';
import { AdminFileController } from './admin.controller';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [],
  controllers: [AdminFileController, FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {
}

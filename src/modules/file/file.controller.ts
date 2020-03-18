import {
  Get, Controller, Body, Put, Param, UseInterceptors, UploadedFile, Req,
  Res, Query, Post
} from '@nestjs/common';
import { File, FileType } from './file.entity';
import * as multer from 'multer';
import * as uuidv4 from 'uuid/v4';
import * as path from 'path';
import * as fs from 'fs';
import { FileService } from './file.service';
import * as gm from 'gm';
import * as imageSize from 'image-size';
import { promisify } from 'util';
import { FileInterceptor } from "@nestjs/platform-express";

const sizeOf = promisify(imageSize);

const storage = multer.diskStorage({
  destination: 'upload',
  filename(req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

export const multerOptions = {
  storage
};

@Controller()
export class FileController {


  constructor(private fileService: FileService) {

  }

  @Post('/v1/file/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@Body() body, @UploadedFile() file, @Query() queryParams): Promise<any> {

    const FileModel = new File().getModelForClass(File);
    const fileDocument = new FileModel(body);

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

      const fileProcessResult = await this.fileService.processJPEG(file.path, file.filename);

      const dimensions = await sizeOf(fileProcessResult.imagePath);

      fileDocument.width = dimensions.width;
      fileDocument.height = dimensions.height;

      fileDocument.url = await this.fileService.uploadFileToS3(fileProcessResult.imagePath, fileProcessResult.imageFileName, file.mimetype);
      fs.unlinkSync(fileProcessResult.imagePath);
      fileDocument.thumbUrl = await this.fileService.uploadFileToS3(fileProcessResult.thumbPath, fileProcessResult.thumbFileName, file.mimetype);
      fs.unlinkSync(fileProcessResult.thumbPath);
      fileDocument.remote = fileProcessResult.imageFileName;
      fileDocument.thumbRemote = fileProcessResult.thumbFileName;

      fileDocument.type = FileType.IMAGE;

    }

    if (file.mimetype === 'image/gif') {

      const uuidFilename = uuidv4();
      const thumbFileName = `${uuidFilename}.jpg`;
      const gifFileName = `${uuidFilename}${path.extname(file.filename)}`;

      await new Promise((resolve, reject) => {
        gm(file.path)
          .selectFrame(0)
          .write(`./upload/${thumbFileName}`, (err) => {
            if (err) {
              return reject();
            }
            resolve();
          });

      });

      const dimensions = await sizeOf(`./upload/${thumbFileName}`);

      fileDocument.width = dimensions.width;
      fileDocument.height = dimensions.height;
      fileDocument.url = await this.fileService.uploadFileToS3(file.path, gifFileName, file.mimetype);
      fileDocument.thumbUrl = await this.fileService.uploadFileToS3(`./upload/${thumbFileName}`, thumbFileName, file.mimetype);
      fs.unlinkSync(file.path);
      fs.unlinkSync(`./upload/${thumbFileName}`);
      fileDocument.remote = gifFileName;
      fileDocument.thumbRemote = thumbFileName;
      fileDocument.type = FileType.GIF;

    }

    fileDocument.size = file.size;
    return fileDocument.save();

  }

}

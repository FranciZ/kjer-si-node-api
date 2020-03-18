import {
  Get,
  Controller,
  Body,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  Post
} from '@nestjs/common';
import { AuthService } from '../common/auth/auth.service';
import { File } from './file.entity';
import * as multer from 'multer';
import * as uuidv4 from 'uuid/v4';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { FileInterceptor } from "@nestjs/platform-express";

const storage = multer.diskStorage({
  destination: 'upload',
  filename(req, file, cb) {
    console.log(file);
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

export const multerOptions = {
  storage
};

@Controller()
export class AdminFileController {


  constructor() {

  }

  @Post('/v1/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@Body() body, @UploadedFile() file): Promise<File> {

    const uuidFilename = uuidv4();
    const imageFileName = `${uuidFilename}${path.extname(file.filename)}`;
    const thumbFileName = `thumb-${uuidFilename}${path.extname(file.filename)}`;

    const thumbPath = `upload/${thumbFileName}`;
    const imagePath = `upload/${imageFileName}`;

    const ImageModel = new File().getModelForClass(File);
    const image = new ImageModel({
      path: imagePath,
      thumbPath: thumbPath,
      url: `${process.env.IMAGE_URL}/${imageFileName}`,
      thumbUrl: `${process.env.IMAGE_URL}/${thumbFileName}`
    });

    await image.save();

    await sharp(file.path, { quality: 100 })
      .resize(1440)
      .toFile(imagePath);

    await sharp(file.path, { quality: 100 })
      .resize(300)
      .toFile(thumbPath);

    fs.unlinkSync(file.path);

    return image;

  }

}

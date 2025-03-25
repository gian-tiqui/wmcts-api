import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  Req,
  Logger,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RateLimit } from 'nestjs-rate-limiter';
import { Messages } from 'src/utils/enums/enum';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';

@Controller('comment')
export class CommentController {
  private logger: Logger = new Logger('CommentController');

  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    try {
      const accessToken = extractAccessToken(req);

      return this.commentService.create(createCommentDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':commentId')
  findOne(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentService.findOne(commentId);
  }

  @Post(':commentId')
  @Post(':floorId/upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 1024 * 1024 * 10 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(Messages.IMAGES_ERROR), false);
        }
      },
    }),
  )
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before uploading images for a room.',
    keyPrefix: 'upload-room-image',
    points: 10,
  })
  upload(
    @Param('commentId', ParseIntPipe) commentId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.commentService.upload(commentId, files, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':commentId')
  update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  remove(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentService.remove(commentId);
  }
}

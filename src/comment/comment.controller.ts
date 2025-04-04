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
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RateLimit } from 'nestjs-rate-limiter';
import { Messages } from 'src/utils/enums/enum';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  private logger: Logger = new Logger('CommentController');

  constructor(private readonly commentService: CommentService) {}

  @Post()
  @RateLimit({
    keyPrefix: 'create-comment',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before creating a comment.',
  })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      return this.commentService.create(createCommentDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  @RateLimit({
    keyPrefix: 'get-comments',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before loading the comments.',
  })
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':commentId')
  @RateLimit({
    keyPrefix: 'get-comment-by-id',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before loading a comment.',
  })
  findOne(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentService.findOne(commentId);
  }

  @Post(':commentId/upload')
  @RateLimit({
    keyPrefix: 'update-comment',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before updating a comment.',
  })
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
  @Patch(':commentId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before uploading images for a room.',
    keyPrefix: 'upload-comment-image',
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
  update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.commentService.update(
        commentId,
        updateCommentDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':commentId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before deleting a comment.',
    keyPrefix: 'delete-comment',
    points: 10,
  })
  remove(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.commentService.remove(commentId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}

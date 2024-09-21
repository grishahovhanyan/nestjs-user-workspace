import { BadRequestException } from '@nestjs/common'
import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

const DEFAULT_FILE_MAX_SIZE_MB = 5

export interface IUploadedFIle {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

const getStorage = (destination: string) => diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniqueSuffix = `${file.originalname}_${Date.now()}`
    callback(null, uniqueSuffix + extname(file.originalname))
  }
})

const getFileFilter = (fileMaxSizeMb = DEFAULT_FILE_MAX_SIZE_MB) => (req, file, callback) => {
  if (file.size > fileMaxSizeMb * 1024 * 1024) {
    return callback(new BadRequestException(`File size exceeds ${fileMaxSizeMb} MB`), false)
  }
  callback(null, true)
}

export function FileUpload(fieldName: string, destination: string, fileMaxSizeMb = DEFAULT_FILE_MAX_SIZE_MB, isMultiple: boolean = false, maxFiles: number = 10) {
  const storage = getStorage(`./uploads/${destination}`)
  const fileFilter = getFileFilter(fileMaxSizeMb)
  return applyDecorators(
    isMultiple
      ? UseInterceptors(FilesInterceptor(fieldName, maxFiles, { storage, fileFilter }))
      : UseInterceptors(FileInterceptor(fieldName, { storage, fileFilter })),
  )
}

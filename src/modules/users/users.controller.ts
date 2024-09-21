import { Get, Query, Param, Patch, Body, UploadedFile } from '@nestjs/common'
import { SwaggerUsers } from '@app/swagger'
import { ApiConsumes } from '@nestjs/swagger'

import {
  PAGE_SIZE_TYPES,
  getPaginationAndSortOrder,
  paginatedResponse,
  NotFoundException,
  EnhancedController,
  RequestUser,
  TransformResponse,
  USERS_SORT_FIELDS,
  FileUpload,
  IUploadedFIle
} from '@app/common'
import { GetUsersDto, UpdateUserDto } from './dto/user.dto'
import { UserResponseDto } from './dto/user-response.dto'

import { UsersService } from './users.service'
import { User } from './entities/user.entity'

@EnhancedController('users')
@TransformResponse(UserResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @SwaggerUsers.getMe()
  @Get('me')
  async getMe(@RequestUser('id') currentUserId: number) {
    return await this.usersService.getById(currentUserId)
  }

  @SwaggerUsers.updateMe()
  @Patch('me')
  @ApiConsumes('multipart/form-data')
  @FileUpload('image', 'users/images', 10)
  async updateMe(
    @RequestUser() currentUser: User,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: IUploadedFIle
  ) {
    if (image) {
      updateUserDto.image = `uploads/users/images/${image.filename}`
    }
    await this.usersService.update(currentUser.id, updateUserDto, currentUser.image)

    const updatedUser = await this.usersService.getById(currentUser.id)

    return updatedUser
  }

  @SwaggerUsers.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetUsersDto) {
    const { page, perPage, order } = getPaginationAndSortOrder(query, PAGE_SIZE_TYPES.users, USERS_SORT_FIELDS)

    const getAndCountInput: GetUsersDto = {
      ...query,
      page,
      perPage,
      order,
      userIdsToExclude: [currentUserId]
    }
    const { items, totalCount } = await this.usersService.getAndCount(getAndCountInput)

    return paginatedResponse(items, totalCount, page, perPage)
  }

  @SwaggerUsers.find()
  @Get(':id')
  async find(@Param('id') userId: number) {
    const user = await this.usersService.getById(userId)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }
}

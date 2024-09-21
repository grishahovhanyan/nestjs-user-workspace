import { SwaggerUsersGetMe } from './users-get-me'
import { SwaggerUsersIndex } from './users-index'
import { SwaggerUsersFind } from './users-find'

export const SwaggerUsers = {
  getMe: SwaggerUsersGetMe,
  updateMe: SwaggerUsersGetMe,
  index: SwaggerUsersIndex,
  find: SwaggerUsersFind
}

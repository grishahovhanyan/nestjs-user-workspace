export enum DbTables {
  users = 'users',
  workspaces = 'workspaces',
  channels = 'channels',
  workspace_invitations = 'workspace_invitations'
}

/* 
####### NOTE #######
This enum is used to centralize all database relationship keys.
For example, instead of using strings like 'user', 'workspaces', or 'channels' directly in the code, 
you should use DbRelations.user, DbRelations.workspaces, and DbRelations.channels respectively.
This ensures consistency and avoids hardcoding strings throughout the project.
*/
export enum DbRelations {
  user = 'user',
  inviter = 'inviter',
  workspace = 'workspace',
  workspaces = 'workspaces',
  channels = 'channels'
}

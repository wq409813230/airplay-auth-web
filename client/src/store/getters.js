const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  noReadMsgCount: state => state.app.noReadMsgCount,
  messageFlag: state => state.app.messageFlag,
  appHeight: state => state.app.appHeight,
  token: state => state.user.token,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  agencyCode: state => state.user.agencyCode,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  routersMap: state => state.permission.routersMap,
  userPermission: state => state.permission.userPermission,
  operButtons: state => state.permission.operButtons,
  mainCode: state => state.permission.mainCode,
  mainModules: state => state.permission.mainModules
}
export default getters

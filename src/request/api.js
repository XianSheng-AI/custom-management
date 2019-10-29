/**   
 * api接口统一管理
 */
import { get, post ,jsonPost, paramsPost ,deletePost, PPost,dele} from './http'







// 退出账号
export const logOut = p => dele('/oauth/token', p);
// 登录
export const apiLogin = p => post('/oauth/token', p);
// 获取部门列表
export const apiCompany = p => get('/api/deptInfo/getDeptList', p);
// 按角色id获取角色信息
export const getRoleInfoById = p => get('/api/role/getRoleInfoById',p);
// 按角色编号获取角色信息
export const getRoleInfoByNo = p => get('/api/role/getRoleInfoByNo',p);
// 获取角色列表
export const getRoleList = p => get('/api/role/getRoleList',p);
// 获取经销商树
export const getDealerTree = p => get('/api/dealer/getDealerTree',p);
// 根据经销商ID查询经销商信息
export const getDealerInfoById = p => get('/api/dealer/getDealerInfoById',p);
// 获取账号分页信息
// export const getAccountPage = p => get('/api/account/getAccountPage',p);
// 获取账号分页信息
export const getAppPageInfo = p => get('/api/appInfo/getAppPageInfo',p);
// 更新账号分页信息
export const modifyAppInfo = p => get('/api/appInfo/modifyAppInfo',p);
// 获取经销商列表（下拉用）
export const getDealerList = p => get('/api/dealer/getDealerList',p);
// 保存经销商信息
export const saveDealerInfo = p => jsonPost('/api/dealer/saveDealerInfo',p);
// 更新经销商信息
export const modifyDealer = p => get('/api/dealer/modifyDealer',p);



// ----------------------------------------系统管理-------------------------------------------
//                          ---------------部门管理---------------
// 获取部门分页信息
export const getDeptPageInfo = p => get('/api/deptInfo/getDeptPageInfo',p);
// 获取部门列表
export const getDeptList = p => get('/api/deptInfo/getDeptList',p);
// 保存部门信息
export const saveDept = p => jsonPost('/api/deptInfo/saveDept',p);
// 删除部门信息
export const deleteDept = p => deletePost('/api/deptInfo/deleteDept',p);
// 批量删除部门信息
export const deletes = p => post('/api/deptInfo/deletes',p);
// 批量设置记录是否可用
export const setMoreDept = p => post('/api/deptInfo/setMoreDept',p);
// 根据单位编号查询单位信息
export const getDeptInfoByNo = p => get('/api/deptInfo/getDeptInfoByNo',p);


//                          ---------------用户管理---------------
// 获取用户列表
export const getUserList = p => get('/api/user/getUserList',p);
// 按用户编号查询用户信息
export const getUserInfoByUserNo = p => get('/api/user/getUserInfoByUserNo',p);
// 保存用户信息
export const saveUserInfo = p => jsonPost('/api/user/saveUserInfo',p);
// 删除用户信息
export const deleteUserInfo = p => post('/api/user/deleteUserInfo',p);
// 批量删除用户信息
export const deletesUsers = p => jsonPost('/api/user/deletes',p);
// 批量設置用戶是否可用
export const setEnableByIds = p => jsonPost('/api/user/setEnableByIds',p);


//                          ---------------角色管理---------------
// 获取角色下拉信息
export const findRolesEnable = p => get('/api/role/findRolesEnable',p);
// 保存角色信息
export const saveRoleInfo = p => jsonPost('/api/role/saveRoleInfo',p);
// 根据id删除角色信息
export const deleteRoleInfo = p => post('/api/role/deleteRoleInfo',p);
// 根据ID禁用记录
export const setEnableById = p => paramsPost('/api/role/setEnableById',p);
// 批量删除角色信息
export const deleteRoles = p => post('/api/role/deletes',p);
//                          ---------------菜单管理---------------
// 获取菜单分页信息
export const getMenuPageInfo = p => get('/api/menu/getMenuPageInfo',p);
// 获取所有菜单
export const getAllMenuList = p => get('/api/menu/getAllMenuList',p);
// 保存单个菜单信息
export const saveMenu = p => jsonPost('/api/menu/saveMenu',p);
// 按菜单ID获取菜单信息
export const getMenuById = p => get('/api/menu/getMenuById',p);
// 删除菜单
export const deleteMenuId = p => post('/api/menu/deleteMenuId',p);
// 获取可用菜单列表
export const getMenuList = p => get('/api/menu/getMenuList',p);
// 按菜单编号获取菜单信息
export const getMenuByNo = p => get('/api/menu/getMenuByNo',p);
// 获取所有可用菜单列表
export const getAllUsableMenuList = p => get('/api/menu/getAllUsableMenuList',p);


//                          ---------------设备类型管理---------------
// 获取设备类型分页信息
export const getDeviceTypePage = p => get('/api/deviceType/getDeviceTypePage',p);



//                          ---------------设备管理---------------
// 分页获取设备信息
export const getDeviceByPageInfo = p => get('/api/deviceInfo/getDeviceByPageInfo',p);
// 更新设备信息
export const UpdateDeviceInfo = p => get('/api/deviceInfo/UpdateDeviceInfo',p);
// 更新设备类型
export const updateDeviceType = p => get('/api/deviceType/updateDeviceType',p);
// 分配设备，修改有效期
export const deviceInfoModify = p => jsonPost('/api/deviceInfo/deviceInfoModify',p);
// 批量修改有效期
export const deviceListModify = p => jsonPost('/api/deviceInfo/deviceListModify',p); //
// 批量修改是否可用
export const setMoreEnable = p => PPost('/api/deviceInfo/setMoreEnable',p);    //query
// 获取设备类型列表
export const getDeviceTypeList = p => get('/api/deviceType/getDeviceTypeList',p);    //query





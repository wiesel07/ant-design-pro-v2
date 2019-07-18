import { stringify } from 'qs';
import request from '@/utils/request';
import { baseUrl } from '@/services/apiConstant';

// 用户模块接口
export async function queryUserPage(params) {
  return request(`${baseUrl}/system/user/pages?${stringify(params)}`);
}

export async function removeUser(params) {
  return request(`${baseUrl}/system/user/remove`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

// 字典模块接口
export async function queryDictPage(params) {
  return request(`${baseUrl}/system/dict/pages?${stringify(params)}`);
}

export async function removeDict(params) {
  return request(`${baseUrl}/system/dict/remove`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}


export async function addDict(params) {
  return request(`${baseUrl}/system/sysDict/remove`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}


export async function updateDict(params) {
  return request(`${baseUrl}/system/sysDict/remove`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

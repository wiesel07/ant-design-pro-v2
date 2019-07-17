import { stringify } from 'qs';
import request from '@/utils/request';
import { baseUrl } from '@/services/apiConstant';


// 字典管理模块接口API
export async function queryDictPage(params) {
  return request(`${baseUrl}/system/sysDict/pages?${stringify(params)}`);
}

export async function removeDict(params) {
  //return request(`${baseUrl}/system/sysDict/remove?${stringify(params)}`);
  return request(`${baseUrl}/system/sysDict/remove`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function addDict(params) {
  // return request(`${baseUrl}/system/sysDict/add`, {
  //   method: 'POST',
  //   data: {
  //     ...params,
  //     method: 'post',
  //   },
  // });

  return request(`${baseUrl}/system/sysDict/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


export async function updateDict(params) {
  return request(`${baseUrl}/system/sysDict/update`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
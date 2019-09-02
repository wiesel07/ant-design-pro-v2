import { stringify } from 'qs';
import request from '@/utils/request';
import { baseUrl } from '@/services/apiConstant';

// 用户模块接口
export async function querySoccerGamePage(params) {
  return request(`${baseUrl}//soccer/soccerGame/pages?${stringify(params)}`);
}

export async function removeSoccerGame(params) {
  return request(`${baseUrl}//soccer/soccerGame/remove`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}
export async function addSoccerGame(params) {
  return request(`${baseUrl}/soccer/soccerGame/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateSoccerGame(params) {
  return request(`${baseUrl}/soccer/soccerGame/update`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function getSoccerGameDetail(params) {
  return request(`${baseUrl}/soccer/soccerGame/detail?${stringify(params)}`);
}

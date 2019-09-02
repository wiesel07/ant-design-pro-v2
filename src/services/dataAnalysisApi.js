import { stringify } from 'qs';
import request from '@/utils/request';
import { baseUrl } from '@/services/apiConstant';


export async function querySoccerGamePage(params) {
  return request(`${baseUrl}/soccer/soccerGame/pages?${stringify(params)}`);
}

export async function removeSoccerGame(params) {
  return request(`${baseUrl}/soccer/soccerGame/remove`, {
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


///// ODDS分析

export async function querySoccerOddsPage(params) {
  return request(`${baseUrl}/soccer/soccerOdds/pages?${stringify(params)}`);
}


export async function addSoccerOdds(params) {
  return request(`${baseUrl}/soccer/soccerOdds/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateSoccerOdds(params) {
  return request(`${baseUrl}/soccer/soccerOdds/update`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function getSoccerOddsDetail(params) {
  return request(`${baseUrl}/soccer/soccerOdds/detail?${stringify(params)}`);
}

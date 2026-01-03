import { requestOptions, handle } from '~/_helpers';

export const fisherService = {
    getCatches,
    getUserPokedex,
    getUserStatistics
}

async function getCatches(): Promise<any> {
  return fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/catches/`, requestOptions.get() as RequestInit)
    .then((res) => {
      return handle.response(res);
    })
    .catch((error) => {
      handle.error(error);
    });
}

async function getUserPokedex(): Promise<any> {
  return fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/users/pokedex/`, requestOptions.get() as RequestInit)
    .then((res) => {
      return handle.response(res);
    })
    .catch((error) => {
      handle.error(error);
    });
}

async function getUserStatistics(): Promise<any> {
  return fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/users/statistics/`, requestOptions.get() as RequestInit)
    .then((res) => {
      return handle.response(res);
    })
    .catch((error) => {
      handle.error(error);
    });
}
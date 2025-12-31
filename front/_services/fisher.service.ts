import { requestOptions, handle } from '~/_helpers';

export const fisherService = {
    getCatches,
    getUserCatches,
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

async function getUserCatches(pseudo : string): Promise<any> {
  return fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/users/catches`, requestOptions.get() as RequestInit)
    .then((res) => {
      return handle.response(res);
    })
    .catch((error) => {
      handle.error(error);
    });
}

async function getUserStatistics(pseudo : string): Promise<any> {
  return fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/users/statistics`, requestOptions.get() as RequestInit)
    .then((res) => {
      return handle.response(res);
    })
    .catch((error) => {
      handle.error(error);
    });
}
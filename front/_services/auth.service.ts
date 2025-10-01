import { requestOptions, handle } from '~/_helpers';

export const authService = {
    getGuestToken
}

async function getGuestToken(): Promise<any> {
  return fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/auth/guest`, requestOptions.get() as RequestInit)
    .then((res) => {
      return handle.response(res);
    })
    .catch((error) => {
      handle.error(error);
    });
}

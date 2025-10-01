import { parse } from 'cookie-es';

export const requestOptions = {
  get() {
    return {
      method: 'GET',
      ...headers()
    };
  },
  post(body: any) {
    return {
      method: 'POST',
      ...headers(),
      body: JSON.stringify(body)
    };
  },
  patch(body: any) {
    return {
      method: 'PATCH',
      ...headers(),
      body: JSON.stringify(body)
    };
  },
  put(body: any) {
    return {
      method: 'PUT',
      ...headers(),
      body: JSON.stringify(body)
    };
  },
  delete() {
    return {
      method: 'DELETE',
      ...headers()
    };
  }
};

function headers() {
  const cookies = parse(document.cookie);
  const token = cookies.auth_token;
  const authHeader = token ? { Authorization: 'Bearer ' + token } : {};
  return {
    headers: {
      ...authHeader,
      'Content-Type': 'application/json',
    }
  };
}

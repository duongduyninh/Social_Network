
const FetchData = {
  get: (url, options) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  },
  post: (url, payload, options) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  },
  patch: (url, payload, options) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'PATCH',
      body: JSON.stringify({ payload }),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  },
  delete: (url, payload, options) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify({ payload }),
      ...options,
    });
  },
};
export default FetchData;

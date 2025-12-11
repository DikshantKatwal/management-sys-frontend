import { cookies as nextCookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
type TServerAPI = {
  url: string;
  data?: any;
  disabled?: boolean;
  options?: RequestInit;
};
const serverApiService = {
  get: ({ url, disabled, options = {} }: TServerAPI) => {
    if (disabled) return Promise.resolve(null);
    return serverRequest({ method: "GET", url: url, fetchOptions: options });
  },
  post: (url: string, data: any) =>
    serverRequest({ method: "POST", url: url, data: data }),
  put: (url: string, data: any) => serverRequest({ method: "PUT", url, data }),
  patch: (url: string, data: any) =>
    serverRequest({ method: "PATCH", url, data }),
  delete: (url: string) => serverRequest({ method: "DELETE", url }),
};

const serverRequest = async ({
  method,
  url,
  data,
  fetchOptions = {},
}: {
  method: string;
  url: string;
  data?: any;
  fetchOptions?: RequestInit;
}) => {
  const cookieStore = await nextCookies();
  const token = cookieStore.get("access_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  let options: RequestInit = {
    method,
    headers,
    ...fetchOptions,
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  let res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

export default serverApiService;

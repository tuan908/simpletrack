type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions extends Omit<RequestInit, "body"> {
  method?: HttpMethod;
  params?: Record<string, string>;
  body?: unknown; // Allow 'unknown' for flexible body handling
}

interface ApiError {
  message: string;
  statusCode?: number;
  [key: string]: unknown; // Allow additional properties
}

function getUrl() {
  let url: string = "";

  if (!process.env.NEXT_PUBLIC_API_URL) {
    url = "http://localhost:3000/api/v1";
  } else {
    url = `https://${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }

  console.info("[URL]", url);
  if (!url) throw new Error("API base URL is not defined");
  return url;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<TResponse>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    const { method = "GET", params, body, headers, ...rest } = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...rest,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: ApiError = {
        message: response.statusText || "An unknown error occurred",
        statusCode: response.status,
      };
      try {
        const jsonError = (await response.json()) as ApiError;
        errorData = { ...errorData, ...jsonError };
      } catch (e) {
        // If response is not JSON, statusText is already set
      }
      throw new Error(errorData.message);
    }

    return (await response.json()) as TResponse;
  }

  get<TResponse>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...options, method: "GET" });
  }

  post<TResponse>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  put<TResponse>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  patch<TResponse>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  delete<TResponse>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new HttpClient(getUrl());

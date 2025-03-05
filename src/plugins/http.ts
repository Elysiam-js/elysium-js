/**
 * HTTP Client Plugin for Elysium.js
 * 
 * Provides a simple HTTP client for making requests from your Elysium.js application
 */

/**
 * HTTP request options
 */
export interface HttpRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * HTTP response interface
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: HttpRequestOptions;
}

/**
 * HTTP error class
 */
export class HttpError extends Error {
  status: number;
  statusText: string;
  data: any;
  config: HttpRequestOptions;
  
  constructor(message: string, response: HttpResponse) {
    super(message);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = response.data;
    this.config = response.config;
  }
}

/**
 * Elysium HTTP Client class
 */
export class ElysiumHttpClient {
  private baseURL: string;
  private defaultOptions: HttpRequestOptions;
  private requestInterceptors: Array<(config: HttpRequestOptions) => HttpRequestOptions | Promise<HttpRequestOptions>> = [];
  private responseInterceptors: Array<(response: HttpResponse) => HttpResponse | Promise<HttpResponse>> = [];
  private errorInterceptors: Array<(error: HttpError) => HttpError | Promise<HttpError>> = [];
  
  constructor(options: { baseURL?: string; defaultOptions?: HttpRequestOptions } = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultOptions = options.defaultOptions || {};
  }
  
  /**
   * Add request interceptor
   */
  addRequestInterceptor(
    interceptor: (config: HttpRequestOptions) => HttpRequestOptions | Promise<HttpRequestOptions>
  ) {
    this.requestInterceptors.push(interceptor);
    return this;
  }
  
  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    interceptor: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>
  ) {
    this.responseInterceptors.push(interceptor);
    return this;
  }
  
  /**
   * Add error interceptor
   */
  addErrorInterceptor(
    interceptor: (error: HttpError) => HttpError | Promise<HttpError>
  ) {
    this.errorInterceptors.push(interceptor);
    return this;
  }
  
  /**
   * Build the full URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = this.baseURL ? new URL(url, this.baseURL).toString() : url;
    
    if (!params) {
      return fullUrl;
    }
    
    const urlObj = new URL(fullUrl);
    
    for (const [key, value] of Object.entries(params)) {
      urlObj.searchParams.append(key, String(value));
    }
    
    return urlObj.toString();
  }
  
  /**
   * Apply request interceptors to the request options
   */
  private async applyRequestInterceptors(options: HttpRequestOptions): Promise<HttpRequestOptions> {
    let interceptedOptions = { ...options };
    
    for (const interceptor of this.requestInterceptors) {
      interceptedOptions = await interceptor(interceptedOptions);
    }
    
    return interceptedOptions;
  }
  
  /**
   * Apply response interceptors to the response
   */
  private async applyResponseInterceptors(response: HttpResponse): Promise<HttpResponse> {
    let interceptedResponse = { ...response };
    
    for (const interceptor of this.responseInterceptors) {
      interceptedResponse = await interceptor(interceptedResponse);
    }
    
    return interceptedResponse;
  }
  
  /**
   * Apply error interceptors to the error
   */
  private async applyErrorInterceptors(error: HttpError): Promise<HttpError> {
    let interceptedError = error;
    
    for (const interceptor of this.errorInterceptors) {
      interceptedError = await interceptor(interceptedError);
    }
    
    return interceptedError;
  }
  
  /**
   * Handle timeout for fetch requests
   */
  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    if (!ms) {
      return promise;
    }
    
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request timed out after ${ms}ms`));
      }, ms);
      
      promise.then(
        (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    });
  }
  
  /**
   * Make an HTTP request
   */
  async request<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    // Merge default options with request options
    const mergedOptions: HttpRequestOptions = {
      ...this.defaultOptions,
      ...options,
    };
    
    // Extract non-fetch options
    const { params, timeout, ...fetchOptions } = mergedOptions;
    
    // Build the full URL with query parameters
    const fullUrl = this.buildUrl(url, params);
    
    // Apply request interceptors
    const interceptedOptions = await this.applyRequestInterceptors({
      ...fetchOptions,
      params,
      timeout,
    });
    
    // Extract non-fetch options again after interceptors
    const { params: _, timeout: timeoutMs, ...finalFetchOptions } = interceptedOptions;
    
    try {
      // Make the fetch request with timeout
      const fetchPromise = fetch(fullUrl, finalFetchOptions);
      const fetchResponse = await this.withTimeout(fetchPromise, timeoutMs || 0);
      
      // Parse response data based on content type
      let data: T;
      const contentType = fetchResponse.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await fetchResponse.json();
      } else if (contentType?.includes('text/')) {
        data = await fetchResponse.text() as unknown as T;
      } else {
        data = await fetchResponse.blob() as unknown as T;
      }
      
      // Create response object
      const response: HttpResponse<T> = {
        data,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers,
        config: interceptedOptions,
      };
      
      // Check if response is successful
      if (!fetchResponse.ok) {
        throw new HttpError(
          `Request failed with status ${fetchResponse.status}`,
          response
        );
      }
      
      // Apply response interceptors
      return await this.applyResponseInterceptors(response);
    } catch (error) {
      // Handle errors
      if (error instanceof HttpError) {
        // Apply error interceptors
        throw await this.applyErrorInterceptors(error);
      } else {
        // Create a new HttpError for other errors
        const errorResponse: HttpResponse = {
          data: null,
          status: 0,
          statusText: error instanceof Error ? error.message : String(error),
          headers: new Headers(),
          config: interceptedOptions,
        };
        
        const httpError = new HttpError(
          error instanceof Error ? error.message : String(error),
          errorResponse
        );
        
        // Apply error interceptors
        throw await this.applyErrorInterceptors(httpError);
      }
    }
  }
  
  /**
   * Make a GET request
   */
  async get<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    const contentType = options.headers?.['Content-Type'] || options.headers?.['content-type'];
    
    // Automatically stringify JSON data if content type is application/json
    if (data && typeof data === 'object' && (!contentType || contentType.includes('application/json'))) {
      return this.request<T>(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    }
    
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data,
    });
  }
  
  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    const contentType = options.headers?.['Content-Type'] || options.headers?.['content-type'];
    
    if (data && typeof data === 'object' && (!contentType || contentType.includes('application/json'))) {
      return this.request<T>(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    }
    
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }
  
  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, data?: any, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    const contentType = options.headers?.['Content-Type'] || options.headers?.['content-type'];
    
    if (data && typeof data === 'object' && (!contentType || contentType.includes('application/json'))) {
      return this.request<T>(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    }
    
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  }
  
  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

/**
 * Create an HTTP client instance
 */
export function createHttpClient(options: { baseURL?: string; defaultOptions?: HttpRequestOptions } = {}): ElysiumHttpClient {
  return new ElysiumHttpClient(options);
}

/**
 * Default HTTP client instance
 */
export const http = createHttpClient();

export default { createHttpClient, http };

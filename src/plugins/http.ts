/**
 * HTTP Client Plugin for Elysium.js
 * 
 * Provides an Axios-based HTTP client for making requests from your Elysium.js application
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Create an HTTP client instance
 * 
 * @param config - Axios configuration options
 * @returns An HTTP client instance
 */
export function createHttpClient(config: AxiosRequestConfig = {}): ElysiumHttpClient {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  
  return new ElysiumHttpClient(instance);
}

/**
 * Elysium HTTP Client class
 */
export class ElysiumHttpClient {
  private client: AxiosInstance;
  
  constructor(client: AxiosInstance) {
    this.client = client;
  }
  
  /**
   * Add request interceptor
   */
  addRequestInterceptor(
    onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onRejected?: (error: any) => any
  ) {
    this.client.interceptors.request.use(onFulfilled, onRejected);
    return this;
  }
  
  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: any) => any
  ) {
    this.client.interceptors.response.use(onFulfilled, onRejected);
    return this;
  }
  
  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  
  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  
  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }
  
  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
  
  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
  
  /**
   * Get the underlying Axios instance
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

/**
 * Default HTTP client instance
 */
export const http = createHttpClient();

export default { createHttpClient, http };

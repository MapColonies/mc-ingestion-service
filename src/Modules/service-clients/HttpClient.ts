/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpService, Inject, HttpException } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { MCLogger } from '@map-colonies/mc-logger';

export abstract class HttpClient {
  constructor(protected baseUrl?: string) {}

  @Inject(HttpService)
  private readonly httpClient: HttpService;

  @Inject(MCLogger)
  protected readonly logger: MCLogger;

  protected async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    if (this.baseUrl) {
      url = this.joinUrl(this.baseUrl, url);
    }
    const req = this.httpClient.post<T>(url, data);
    const res = await this.HandleResponse(req);
    return res;
  }

  protected async Put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    if (this.baseUrl) {
      url = this.joinUrl(this.baseUrl, url);
    }
    const req = this.httpClient.put<T>(url, data);
    const res = await this.HandleResponse(req);
    return res;
  }

  protected async patch<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    if (this.baseUrl) {
      url = this.joinUrl(this.baseUrl, url);
    }
    const req = this.httpClient.patch<T>(url, data);
    const res = await this.HandleResponse(req);
    return res;
  }

  protected async get<T>(url: string): Promise<AxiosResponse<T>> {
    if (this.baseUrl) {
      url = this.joinUrl(this.baseUrl, url);
    }
    const req = this.httpClient.get<T>(url);
    const res = await this.HandleResponse(req);
    return res;
  }

  protected async delete<T>(url: string): Promise<AxiosResponse<T>> {
    if (this.baseUrl) {
      url = this.joinUrl(this.baseUrl, url);
    }
    const req = this.httpClient.delete<T>(url);
    const res = await this.HandleResponse(req);
    return res;
  }

  protected async head<T>(url: string): Promise<AxiosResponse<T>> {
    if (this.baseUrl) {
      url = this.joinUrl(this.baseUrl, url);
    }
    const req = this.httpClient.head<T>(url);
    const res = await this.HandleResponse(req);
    return res;
  }

  protected joinUrl(...urlParts: string[]): string {
    if (!urlParts || urlParts.length == 0) {
      return '';
    }
    let url = urlParts[0];
    for (let i = 1; i < urlParts.length; i++) {
      if (url.endsWith('/')) {
        url += urlParts[i];
      } else {
        url += '/' + urlParts[i];
      }
    }
    return url;
  }

  protected async HandleResponse<T>(
    request: Observable<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    const promise = request.toPromise();
    try {
      return await promise;
    } catch (err) {
      if (err?.isAxiosError) {
        err = err as AxiosError;
        const serverError = err?.response?.data?.message;
        const message =
          serverError ||
          err?.response?.statusText ||
          'cannot connect to service';
        this.logger.warn(
          'received error from external service: %s',
          err.toJSON()
        );
        const status = err?.response?.status || 500;
        throw new HttpException(message, status);
      }
    }
  }
}

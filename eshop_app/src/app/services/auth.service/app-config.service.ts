import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';

export interface AppConfig {
    apiUrl: string;
}
@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private config: AppConfig | null = null;

    constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

    async load(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
      return;
    }
        const response = await fetch('/config.json');
        console.log('config response', response.status, response.url);

        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.statusText}`);
        }

        this.config = await response.json();
        console.log('loaded config', this.config);
    }

    get apiUrl(): string {
        if (!this.config?.apiUrl) {
            throw new Error('App config not loaded or apiUrl is missing');
        }
        return this.config.apiUrl;
    }
}

// import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

// export interface AppConfig {
//   apiUrl: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AppConfigService {
//   private config: AppConfig | null = null;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: object,
//     @Inject(DOCUMENT) private document: Document
//   ) {}

//   async load(): Promise<void> {
//     if (!isPlatformBrowser(this.platformId)) {
//       return;
//     }

//     const url = new URL('/config.json', this.document.location.origin).toString();
//     console.log('Loading config from:', url);

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
//     }

//     this.config = await response.json();
//     console.log('Loaded config:', this.config);
//   }

//   get apiUrl(): string {
//     if (!this.config?.apiUrl) {
//       throw new Error('App config not loaded or apiUrl is missing');
//     }
//     return this.config.apiUrl;
//   }
// }
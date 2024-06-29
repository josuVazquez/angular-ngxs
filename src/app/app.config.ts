import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngxs/store';
import { routes } from './app.routes';
import { CartState } from './cart/cart.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideClientHydration(),
    provideExperimentalZonelessChangeDetection(),
    provideStore([CartState]),
  ],
};

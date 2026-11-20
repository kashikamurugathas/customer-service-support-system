
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding
} from '@angular/router';

import { routes } from './app.routes';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject } from '@angular/core';
import { InMemoryCache } from '@apollo/client';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),

    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: environment.graphqlUri,
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};

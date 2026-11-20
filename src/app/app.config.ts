
import { inject, provideAppInitializer } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';

export const provideGraphQL = () =>
  provideApollo(() => {
    const httpLink = inject(HttpLink);

    return {
      link: httpLink.create({
        uri: 'http://127.0.0.1:8000/graphql/',
      }),
      cache: new InMemoryCache(),
    };
  });

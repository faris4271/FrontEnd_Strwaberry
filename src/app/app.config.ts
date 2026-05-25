import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authInterceptor } from './Interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './Interceptors/refresh-token.interceptor';
import { AuthInitializerService } from './Services/auth-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideToastr(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, refreshTokenInterceptor])
    ),
    importProvidersFrom(
      TranslateModule.forRoot()
    ),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json',
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (authInitializer: AuthInitializerService) => () => authInitializer.initialize(),
      deps: [AuthInitializerService],
      multi: true
    }
  ]
};

import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AppInitService } from './app/services/app-init.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageService } from './app/services/storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window); // for capacitor

if (environment.production) {
  enableProdMode();
}

const initializeApp = (appInitService: AppInitService) => {
  return (): Promise<void> => {
    return appInitService.initApp();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    importProvidersFrom(IonicStorageModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService, StorageService],
      multi: true
    },
    importProvidersFrom(BrowserAnimationsModule)
  ],
});

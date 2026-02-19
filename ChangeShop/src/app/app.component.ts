import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit() {
    this.setupDeepLinks();
  }

  setupDeepLinks() {
    // Escucha cuando la app se abre desde una URL (QR o enlace)
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // event.url será "changeshop://miPerfil"

        // Limpiamos el protocolo para quedarnos con la ruta
        // Ejemplo: de "changeshop://miPerfil" a "/miPerfil"
        const domain = 'changeshop://';
        const path = event.url.split(domain).pop();

        if (path) {
          // Navegamos a la ruta interna de Angular
          this.router.navigateByUrl(`/${path}`);
        }
      });
    });
  }
}

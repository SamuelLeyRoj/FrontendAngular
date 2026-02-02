import { Component } from '@angular/core';
import {IonicModule, NavController} from '@ionic/angular';
import {IonAlert, IonCol, IonGrid, IonIcon, IonRow} from "@ionic/angular/standalone";

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonAlert
  ]

})
export class MenuNavegacionComponent {

  mostrar = false;

  mostrarAlerta() {
    this.mostrar = true;
  }


  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private navCtrl: NavController) {}


  irDeVuelta() {
    this.navCtrl.navigateForward('/inicio');
  }

  irContactos(){
    this.navCtrl.navigateForward('/contactos');
  }

  irMiCuenta(){
    this.navCtrl.navigateForward('/miPerfil');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonFooter, IonButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonList, IonLabel
} from "@ionic/angular/standalone";

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { cameraOutline, cloudUploadOutline } from 'ionicons/icons';

import { MenuNavegacionComponent } from "../../componentes/menu-navegacion/menu-navegacion.component";
import { BotonesNavegacionComponent } from "../../componentes/botones-navegacion/botones-navegacion.component";
import { MiRopaIntercambioYPendientesComponent } from "../../componentes/mi-ropa-intercambio-ypendientes/mi-ropa-intercambio-ypendientes.component";

// Interface ajustada a la entidad Ropa de Java
interface Prenda {
  nombre: string;
  imagenBase64: string;
  estado: string;
}

@Component({
  selector: 'app-mis-prendas-inicio',
  templateUrl: './mis-prendas-inicio.component.html',
  styleUrls: ['./mis-prendas-inicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader, IonContent, IonFooter, IonButton, IonIcon,
    IonCard, IonCardContent, IonList, IonItem, IonInput,
    MenuNavegacionComponent,
    BotonesNavegacionComponent,
    MiRopaIntercambioYPendientesComponent
  ]
})
export class MisPrendasInicioPage {

  nuevaPrenda: Prenda = {
    nombre: '',
    imagenBase64: '',
    estado: 'disponible'
  };

  fotoTomada: string | undefined;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {
    addIcons({ cameraOutline, cloudUploadOutline });
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        saveToGallery: true
      });

      if (image.base64String) {
        // Guardamos el string con el prefijo necesario para mostrarlo en <img>
        this.fotoTomada = 'data:image/jpeg;base64,' + image.base64String;
        this.nuevaPrenda.imagenBase64 = this.fotoTomada;
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  subirAlServidor() {
    if (!this.nuevaPrenda.imagenBase64) {
      alert('Toma una foto primero');
      return;
    }

    if (!this.nuevaPrenda.nombre) {
      alert('Escribe un nombre para la prenda');
      return;
    }


    const url = 'http://10.0.2.2:8080/ropa/subir';

    this.http.post(url, this.nuevaPrenda).subscribe({
      next: (res) => {
        alert('¡Ropa guardada en Postgres!');
        // Resetear formulario
        this.nuevaPrenda = { nombre: '', imagenBase64: '', estado: 'disponible' };
        this.fotoTomada = undefined;
      },
      error: (err) => {
        console.error('Error al subir', err);
        alert('Error al conectar con el servidor. Revisa que Spring Boot esté corriendo.');
      }
    });
  }
}

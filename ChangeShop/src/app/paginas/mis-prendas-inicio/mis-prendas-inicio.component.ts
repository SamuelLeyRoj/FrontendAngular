import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonFooter, IonButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonList, IonLabel, IonImg
} from "@ionic/angular/standalone";

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { cameraOutline, cloudUploadOutline } from 'ionicons/icons';

import { MenuNavegacionComponent } from "../../componentes/menu-navegacion/menu-navegacion.component";
import { BotonesNavegacionComponent } from "../../componentes/botones-navegacion/botones-navegacion.component";
import { MiRopaIntercambioYPendientesComponent } from "../../componentes/mi-ropa-intercambio-ypendientes/mi-ropa-intercambio-ypendientes.component";

interface Prenda {
  nombre: string;
  imagen: string; // Guardaremos la URL o el nombre del archivo
  estado: string;
}

@Component({
  selector: 'app-mis-prendas-inicio',
  templateUrl: './mis-prendas-inicio.component.html',
  styleUrls: ['./mis-prendas-inicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    IonHeader, IonContent, IonFooter, IonButton, IonIcon,
    IonCard, IonCardContent, IonList, IonItem, IonInput,
    MenuNavegacionComponent, BotonesNavegacionComponent,
    MiRopaIntercambioYPendientesComponent
  ]
})
export class MisPrendasInicioPage {

  nuevaPrenda: Prenda = {
    nombre: '',
    imagen: '',
    estado: 'disponible'
  };

  // Esta variable guardará el archivo real para subirlo
  blobFoto: Blob | undefined;
  // Esta para mostrar la previsualización en el móvil
  fotoPreview: string | undefined;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {
    addIcons({ cameraOutline, cloudUploadOutline });
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64, // Seguimos pidiendo Base64 para convertirlo fácil
        source: CameraSource.Camera,
        saveToGallery: true
      });

      if (image.base64String) {
        // 1. Mostrar preview en la pantalla
        this.fotoPreview = 'data:image/jpeg;base64,' + image.base64String;

        // 2. Convertir el Base64 en un "Blob" (archivo binario) para el servidor
        const byteCharacters = atob(image.base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        this.blobFoto = new Blob([byteArray], { type: 'image/jpeg' });
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  subirAlServidor() {
    if (!this.blobFoto) {
      alert('Toma una foto primero');
      return;
    }

    if (!this.nuevaPrenda.nombre) {
      alert('Escribe un nombre para la prenda');
      return;
    }

    // --- PASO 1: Subir el archivo físico ---
    const formData = new FormData();
    // Importante: 'file' debe coincidir con @RequestParam("file") en Java
    formData.append('file', this.blobFoto, `foto_${Date.now()}.jpg`);

    const url = 'https://backendsprinboot-1.onrender.com/ropa/subir';

    this.http.post(url, formData).subscribe({
      next: (res: any) => {
        // El servidor nos devuelve el nombre del archivo guardado
        // Ahora armamos la URL pública
        const urlPublicaFoto = `http://10.0.2.2:8080/uploads/${res.nombre}`;
        this.nuevaPrenda.imagen = urlPublicaFoto;

        // --- PASO 2: Guardar los datos en la BD ---
        this.guardarEnBaseDatos();
      },
      error: (err) => {
        console.error('Error al subir archivo', err);
        alert('Fallo al subir la imagen al servidor');
      }
    });
  }

  private guardarEnBaseDatos() {
    // Aquí usamos el ID del usuario (suponiendo ID 1 para la prueba)
    const idUsuario = 1;
    const urlCrear = `http://10.0.2.2:8080/ropa/crear/${idUsuario}`;

    this.http.post(urlCrear, this.nuevaPrenda).subscribe({
      next: () => {
        alert('¡Prenda creada con éxito y foto guardada en carpeta!');
        this.resetearFormulario();
      },
      error: (err) => {
        console.error('Error al crear registro', err);
        alert('Se subió la foto pero no se guardó en la BD');
      }
    });
  }

  resetearFormulario() {
    this.nuevaPrenda = { nombre: '', imagen: '', estado: 'disponible' };
    this.fotoPreview = undefined;
    this.blobFoto = undefined;
  }
}

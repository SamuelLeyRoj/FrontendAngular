import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, AlertController } from "@ionic/angular";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline, star, createOutline } from 'ionicons/icons';
import { RopaService } from "../../services/Ropa-Service";
import { Ropa } from "../../models/Ropa";
// ÚNICO CAMBIO: Asegúrate de que esta ruta apunte a tu archivo de environment real
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cartas-ropa',
  templateUrl: './cartas-ropa.component.html',
  styleUrls: ['./cartas-ropa.component.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule, IonButton]
})
export class CartasRopaComponent implements OnInit {

  ropa: Ropa[] = [];
  private service = inject(RopaService);
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ trashOutline, star, createOutline });
  }

  ngOnInit() {
    this.cargarRopa();
  }

  cargarRopa() {
    this.service.consultarRopa().subscribe({
      next: (data) => this.ropa = data,
      error: error => console.error('Error cargando ropa:', error)
    });
  }

  irInformacionRopa() {
    this.navCtrl.navigateForward('/ropaInformacion');
  }

  borrarPrenda(id: number | undefined, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (!id) return;
    if (!confirm('¿Seguro que quieres eliminar?')) return;

    this.service.eliminarRopa(id).subscribe({
      next: () => this.ropa = this.ropa.filter(r => r.id !== id),
      error: (err) => console.error(err)
    });
  }

  async abrirEditar(item: Ropa, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    const alert = await this.alertCtrl.create({
      header: 'Editar Ropa',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre', value: item.nombre },
        { name: 'estilo', type: 'text', placeholder: 'Estilo', value: item.estilo },
        { name: 'foto', type: 'url', placeholder: 'URL de la foto', value: item.foto }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.guardarEdicion(item.id, data);
          }
        }
      ]
    });

    await alert.present();
  }

  guardarEdicion(id: number | undefined, nuevosDatos: any) {
    if (!id) return;

    const ropaActualizada: Ropa = {
      id: id,
      nombre: nuevosDatos.nombre,
      estilo: nuevosDatos.estilo,
      foto: nuevosDatos.foto
    };

    this.service.actualizarRopa(id, ropaActualizada).subscribe({
      next: (resp) => {
        console.log('Actualizado correctamente');
        const index = this.ropa.findIndex(r => r.id === id);
        if (index > -1) {
          this.ropa[index] = resp;
        }
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        alert('No se pudo actualizar la prenda.');
      }
    });
  }
}

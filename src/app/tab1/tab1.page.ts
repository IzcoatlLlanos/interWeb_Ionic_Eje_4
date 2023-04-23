import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild  } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validator, FormBuilder } from '@angular/forms';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Producto } from '../models/producto';
import { Category } from '../models/category';
import { Calification } from '../models/calification';
import { CategoryService } from '../services/category.service';
import { ProductoService } from '../services/producto.service';

import {AlertController,IonSearchbar,IonSelect,ModalController,ToastController,} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ExploreContainerComponent, FormsModule, ReactiveFormsModule],
})
export class Tab1Page {
  @ViewChild('ionBusqueda') busqueda!: IonSearchbar;

  isContentLoaded: boolean = false;
  formProducto: FormGroup;
  isModalOpen = false;
  categorias: Category[] = [];
  productos: Producto[] = [];
  fProductos: Producto[] = [];
  constructor(
    private catService: CategoryService,
    private prodService: ProductoService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.categorias = catService.getCatego();
    this.productos = prodService.getProductos();
    this.fProductos = this.productos;
    this.formProducto = this.fb.group({});

    
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ionViewDidEnter() {
    this.busqueda.setFocus();
    this.isContentLoaded = true;
  }

  public filter (dato: String) {
    if (!dato.trim()) {
      this.fProductos = this.productos;
      return;
    }
    this.fProductos = this.productos.filter((prod) =>
          prod.name.toLowerCase().includes(dato.toLowerCase())
    );
  }

  public filterProduct(event: Event) {
    if (event instanceof CustomEvent) {
      this.filter(event.detail.value);
    }
  }

  public newProduct() {
    alert('SKU: '+this.formProducto.controls['sku'].value+'nAME: '+this.formProducto.controls['name'].value+'Price: '+this.formProducto.controls['price'].value);


    //this.studentService.newStudent(this.myForm.getRawValue());
    /*const newProd: Producto = {
      sku:this.formProducto.controls['sku'].value, 
      name:this.formProducto.controls['name'].value, 
      description:this.formProducto.controls['description'].value, 
      price:this.formProducto.controls['price'].value, 
      category:this.formProducto.controls['category'].value,
      stock:this.formProducto.controls['stock'].value,
      photo:this.formProducto.controls['photo'].value, 
    };
    this.presentToast('Producto Agregado','success');
    this.prodService.addProduct(newProd);
    this.isModalOpen = false;*/
  }

  private async confirmationDialog(
    header: string,
    handler?: Function,
    dismissFunction?: Function
  ) {
    const alert = await this.alertController.create({
      header,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentToast('Operación cancelada', 'warning');
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            if (handler) handler();
            this.presentToast('Operación realizada', 'success');
          },
        },
      ],
    });
    alert.present();
    alert.onDidDismiss().then((respuesta) => {
      if (dismissFunction) dismissFunction(respuesta);
    });
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 500,
      color,
    });
    toast.present();
  }
}

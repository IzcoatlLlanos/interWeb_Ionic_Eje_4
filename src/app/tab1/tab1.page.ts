import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild  } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  updateOrDelete: boolean = true;
  isContentLoaded: boolean = false;
  formProducto: FormGroup;
  isModalOpen = false;
  categorias: Category[] = [];
  productos: Producto[] = [];
  fProductos: Producto[] = [];
  validationMessages;

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
      this.formProducto = this.fb.group({
        sku:["",Validators.required],
        name:["",Validators.required],
        description:[""],
        price:["",Validators.compose([Validators.min(0), Validators.required])],
        category:["",Validators.required],
        calification:[""],
        stock:["",Validators.compose([Validators.required,Validators.min(0)])],
        photo:[""],
        promCal:[""]   
      });

      this.validationMessages = {
        'sku':[
          {type: 'required', message: 'SKU requerido!'}
        ],
        'name':[
          {type: 'required', message: 'NOMBRE requerido!'}
        ],
        'price':[
          {type: 'required', message: 'PRECIO requerido!'},
          {type: 'min', message: 'Numero invalido!'}
        ],
        'category':[
          {type: 'required', message: 'CATEGORIA requerida!'}
        ],
        'stock':[
          {type: 'required', message: 'STOCK requerido!'},
          {type: 'min', message: 'Numero invalido!'}
        ],
      }

    
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openToAddProduct() {
    this.setOpen(true);
    this.updateOrDelete = true;
  }

  public closeAddModal(){
    if(!this.updateOrDelete) {
      this.formProducto.reset();
      this.updateOrDelete = true;
    }
    this.isModalOpen = false;
    
    this.presentToast('Operación cancelada','danger');
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
    if(!this.updateOrDelete) {
      this.prodService.uploadProduct(this.formProducto.getRawValue());
      this.updateOrDelete = true;
    }else if(this.updateOrDelete) {
      this.prodService.addProduct(this.formProducto.getRawValue());
      this.presentToast('Producto Agregado','success');
    }
    this.formProducto.reset();
    this.isModalOpen = false;
  }

  public updateProduct(prod: Producto) {
    this.isModalOpen = true;
    this.formProducto.patchValue(prod); 
    this.updateOrDelete = false;
  }

  public deleteProduct(prod: Producto) {
    this.confirmationDialog('Estas seguro de borrar el producto: '+prod.name,
      () => {
        this.productos = this.prodService.deleteProducto(prod);
    });
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

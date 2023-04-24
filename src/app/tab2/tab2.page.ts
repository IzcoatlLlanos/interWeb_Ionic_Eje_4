import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl, Validator, FormBuilder } from '@angular/forms';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Producto } from '../models/producto';
import { Category } from '../models/category';
import { Calification } from '../models/calification';
import { ProductoService } from '../services/producto.service';
import { CategoryService } from '../services/category.service';


import {AlertController,IonSearchbar,IonSelect,ModalController,ToastController,} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ExploreContainerComponent, FormsModule, ReactiveFormsModule]
})
export class Tab2Page {
  @ViewChild('ionBusqueda') busqueda!: IonSearchbar;

  productos: Producto[] = [];
  fProductos: Producto[] = [];
  categorias: Category[] = [];

  constructor(
    private prodServ: ProductoService,
    private cateServ: CategoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
      this.categorias = this.cateServ.getCatego();
      this.productos = this.prodServ.getProductos();
      this.fProductos = this.productos;
      
  }
  getColor(type: string): string {
    switch (type) {
      case 'Atrapa Sueños':
        return 'danger';
      case 'Mandala':
        return 'success';
      case 'Ojos de Dios':
        return 'warning';
      default:
        return 'primary';
    }
  }
  desplegarProducto(sku: string){
    alert(sku);
  }

  getColorStock(stock: number): string {
    if(stock>0) return 'success';
    else return 'danger';
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

}

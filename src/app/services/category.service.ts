import { Injectable } from '@angular/core';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private cat: Category[] = [];

  constructor() {
    this.cat.push({
      idCategoryOK: '1',
      idCategoryBK: 'Atrapa Sueños'
    },{
      idCategoryOK: '2',
      idCategoryBK: 'Mandala'
    },{
      idCategoryOK: '3',
      idCategoryBK: 'Ojos de Dios'
    });
  }

  public getCatego(): Category[] {
    return this.cat;
  }
}

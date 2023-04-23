import { Injectable } from '@angular/core';
import { Calification } from '../models/calification';

@Injectable({
  providedIn: 'root'
})
export class CalificationService {

  private califications: Calification[] = [];



  constructor() {
    this.califications.push({
      sku: '12',
      name: 'Josue Rivera',
      coment: 'Excelente producto',
      calification: 5,
      fecha: new Date()
    },{
      sku: '11',
      name: 'Karin Perez',
      coment: 'No muy fue lo que esperaba',
      calification: 3,
      fecha: new Date()
    })
  }

  public getCalifications() {
    return this.califications;
  }

  public newCalification(calif: Calification, sku: string): Calification[] {
    return this.califications.filter( cal => { return cal.sku == sku});
  }
}

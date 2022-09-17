import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];
  }
  constructor(private _http: HttpClient) {}

  paisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name`;
    return this._http.get<PaisSmall[]>(url);
  }

  paisPorCodigo(codigo: string): Observable<Pais[] | null> {
    if (!codigo) {
      return of(null);
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`;
    return this._http.get<Pais[]>(url);
  }

  paisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this._http.get<PaisSmall>(url);
  }

  paisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.paisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}

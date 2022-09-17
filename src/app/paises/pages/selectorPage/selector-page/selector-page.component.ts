import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from 'src/app/paises/services/paises.service';
import { PaisSmall } from 'src/app/paises/interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this._fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: [' ', Validators.required],
  });
  //Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _paisesService: PaisesService
  ) {}

  ngOnInit(): void {
    this.regiones = this._paisesService.regiones;

    //Cuando cambie la región
    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this._paisesService.paisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    //Cuando cambia el pais
    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap((codigo) => this._paisesService.paisPorCodigo(codigo)),
        switchMap((pais) =>
          this._paisesService.paisesPorCodigos(pais ? pais[0]?.borders : [])
        )
      )
      .subscribe((paises) => {
        // this.fronteras = pais ? pais[0]?.borders : [];
        this.fronteras = paises;
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}

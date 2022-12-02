import { PensamentoService } from './../pensamento.service';
import { Component, OnInit } from '@angular/core';
import { Pensamento } from '../pensamento';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { filter, map, Observable, of, take, tap, throwIfEmpty } from 'rxjs';
import { TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-listar-pensamento',
  templateUrl: './listar-pensamento.component.html',
  styleUrls: ['./listar-pensamento.component.css']
})
export class ListarPensamentoComponent implements OnInit {

  listaPensamentos: Pensamento[] = [];
  haMaisPensamentos: boolean = true;
  paginaAtual: number = 1;
  filtro: string = '';
  listaPensamentosTotal: Pensamento[] = [];
  listaPensamentosFiltrada: Pensamento[] = [];
  form!: FormGroup;


  constructor(
    private service: PensamentoService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.pegaListaDePensamentos();
    this.initForm();
    this.filtraPorInput();
  }

  pegaListaDePensamentos() {
    this.service.listar(this.paginaAtual).subscribe((listaPensamentos) => {
      this.listaPensamentosTotal = listaPensamentos;
    });
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      filtro: ['']
    });
  }

  carregarMaisPensamentos(): void {
    this.service.listar(++this.paginaAtual)
      .pipe(take(1))
      .subscribe({
        next: novosPensamentos => {
          this.listaPensamentosTotal.push(...novosPensamentos);
          if (!novosPensamentos.length) {
            this.haMaisPensamentos = false;
          }
        },
        error: err => console.log(err.error)
      })
  }

  // pesquisarPensamentos(): void {
  //   this.haMaisPensamentos = true;
  //   this.paginaAtual = 1;
  //   this.service.listar(this.paginaAtual, this.filtro).subscribe({
  //     next: response => this.listaPensamentos = response,
  //     error: err => console.log(err.error)
  //   })
  // }

  filtraPorInput(): void {
    this.form.get('filtro')?.valueChanges.subscribe({
      next: response => {
        console.log(response)
        if (this.form.value.filtro.trim().length > 3) {
          this.listaPensamentosFiltrada = this.listaPensamentosTotal.filter(
            elemento => elemento.autoria.trim().includes(response)
          );
          console.log(this.listaPensamentos);
          this.listaPensamentos = this.listaPensamentosFiltrada;
          return;
        }
        this.listaPensamentos = this.listaPensamentosTotal;
        console.log('entrou');

      },
      error: err => console.log(err.error)
    });

  }

}


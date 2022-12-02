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

  constructor(
    private service: PensamentoService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.pegaListaDePensamentos();
  }

  pegaListaDePensamentos() {
    this.service.listar(this.paginaAtual, this.filtro).subscribe((listaPensamentos) => {
      this.listaPensamentos = listaPensamentos;
    });
  }

  carregarMaisPensamentos(): void {
    this.service.listar(++this.paginaAtual, this.filtro)
      .pipe(take(1))
      .subscribe({
        next: novosPensamentos => {
          this.listaPensamentos.push(...novosPensamentos);
          if (!novosPensamentos.length) {
            this.haMaisPensamentos = false;
          }
        },
        error: err => console.log(err.error)
      })
  }

  pesquisarPensamentos(): void {
    this.haMaisPensamentos = true;
    this.paginaAtual = 1;
    this.service.listar(this.paginaAtual, this.filtro).subscribe({
      next: response => this.listaPensamentos = response,
      error: err => console.log(err.error)
    })
  }


}


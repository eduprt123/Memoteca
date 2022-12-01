import { PensamentoService } from './../pensamento.service';
import { Component, OnInit } from '@angular/core';
import { Pensamento } from '../pensamento';

@Component({
  selector: 'app-listar-pensamento',
  templateUrl: './listar-pensamento.component.html',
  styleUrls: ['./listar-pensamento.component.css']
})
export class ListarPensamentoComponent implements OnInit {

  listaPensamentos: Pensamento[] = [];
  haMaisPensamentos: boolean = true;
  paginaAtual: number = 1;

  constructor(private service: PensamentoService) { }

  ngOnInit(): void {
    this.service.listar(1).subscribe((listaPensamentos) => {
      this.listaPensamentos = listaPensamentos
    })
  }

  carregarMaisPensamentos(): void {
    this.service.listar(++this.paginaAtual).subscribe({
      next: novosPensamentos => {
        this.listaPensamentos.push(...novosPensamentos);
        if (!novosPensamentos.length) {
          this.haMaisPensamentos = false;
        }
      },
      error: err => console.log(err.error)
    })
  }
}


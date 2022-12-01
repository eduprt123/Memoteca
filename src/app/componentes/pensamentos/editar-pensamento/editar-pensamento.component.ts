import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PensamentoService } from './../pensamento.service';
import { Pensamento } from './../pensamento';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-pensamento',
  templateUrl: './editar-pensamento.component.html',
  styleUrls: ['./editar-pensamento.component.css']
})
export class EditarPensamentoComponent implements OnInit {

  form!: FormGroup;
  pensamento!: Pensamento;
  id: string;


  constructor(
    private service: PensamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.initForm();
    this.service.buscarPorId(parseInt(this.id!)).subscribe((pensamento) => {
      this.pensamento = pensamento
      console.log(pensamento)
      this.loadForm();
    })
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      conteudo: ['', Validators.compose([
        Validators.required, Validators.pattern(/(.|\s)*\S(.|\s)*/)
      ])],
      autoria: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      modelo: ['', [Validators.required]]
    })
  }

  // loadForm(): void {
  //   const { conteudo, autoria, modelo } = this.pensamento;
  //   this.form.patchValue({
  //     conteudo: [conteudo],
  //     autoria: [autoria],
  //     modelo: [modelo]
  //   })
  //   console.log(modelo);
  //   this.form.setValue;
  // }

  loadForm(): void {
    const { conteudo, autoria, modelo } = this.pensamento;
    this.form = this.formBuilder.group({
      id: [this.id],
      conteudo: [conteudo, Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/)
      ])],
      autoria: [autoria, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      modelo: [modelo]
    })
  }

  editarPensamento(): void {
    this.service.editar(this.pensamento).subscribe(() => {
      this.router.navigate(['/listarPensamento'])
    })

  }

  cancelar(): void {
    this.router.navigate(['/listarPensamento'])
  }

  habilitaBotao(): string {
    if (this.form.valid) {
      return 'botao';
    }
    else {
      return 'botao__desabilitado';
    }
  }

}

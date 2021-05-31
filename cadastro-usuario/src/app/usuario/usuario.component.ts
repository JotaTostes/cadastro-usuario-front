import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs'; 
import { UsuarioService } from '../usuario.service';  
import { Usuario } from '../usuario'; 
import { Sexo } from '../Sexo/sexo'; 
import { MatSnackBar } from '@angular/material/snack-bar';
// import { create } from 'domain';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  dataSaved = false; 
  isChecked = true; 
  usuarioForm: any;  
  allUsuarios: Observable<Usuario[]>; 
  allSexo: Sexo[];
  usuarioIdUpdate = 0;
  titleAlert: string = 'Este campo é obrigatório';  
  message? = "";
  post: any = '';
  selectedSexo: number;
  pageTitle: string = 'Cadastrar Usuario';
  // hide: boolean = true;

  constructor(private formbulider: FormBuilder, private usuarioService:UsuarioService, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.loadAllSexos();
    this.createForm();
    this.loadAllUsuarios();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.usuarioForm = this.formbulider.group({
      'Id': [null,null],
      'Sexo': '',
      'Email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'Nome': [null, Validators.required],
      'Senha': [null, [Validators.required, this.checkPassword]],
      'DataNascimento': [null, [Validators.required]],
      'Ativo': true,
      'validate': ''
    });
  }


  checkPassword(control : any) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorPassword() {
    return this.usuarioForm.get('Password').hasError('required') ? 'Campo obrigatório (no minimo 8 caracteres, 1 letra maiuscula e 1 numero)' :
      this.usuarioForm.get('Password').hasError('requirements') ? 'Senha deve conter no minimo 8 caracteres, 1 letra maiuscula e 1 numero' : '';
  }

  getErrorEmail() {
    return this.usuarioForm.get('Email').hasError('required') ? 'Campo obrigatório' :
      this.usuarioForm.get('Email').hasError('pattern') ? 'Este email não é valido' : '';
  }

  loadAllUsuarios() {  
    this.allUsuarios = this.usuarioService.getAllUsuarios();  
  }

  loadAllSexos(){
    this.usuarioService.getAllSexo().subscribe(data => {
      this.allSexo = data
    });
  }

checkSexo(sexo: number){
let sexoDescription=  sexo === 1 ? 'Masculino' : 'Femenino';
return sexoDescription;
}

checkStatus(status: boolean){
  let statusDescription=  status === true ? 'Ativo' : 'Inativo';
  return statusDescription;
  }

  changeSexo(data : any){
    console.log("data sexo", data);
    this.selectedSexo = data.value;

    console.log("selectredSexo", this.selectedSexo);
  }

  onFormSubmit(post : any) {  
    this.dataSaved = false;  
    const usuario = this.usuarioForm.value;  
    this.CreateUsuario(usuario);  
    this.usuarioForm.reset();  
    this.post = post;
  } 

  CreateUsuario(usuario: Usuario) {  
    console.log("json usuario", usuario)
    console.log("usuarioidUpdatre", this.usuarioIdUpdate)

    if (this.usuarioIdUpdate == 0) {  
      this.usuarioService.createUsuario(usuario).subscribe(  
        () => {  
          this.dataSaved = true;  
          this._snackBar.open('Registro salvo com sucesso !!!', 'Fechar') 
          this.loadAllUsuarios();  
          this.resetForm();
        }  
      );  
    } else {  
      usuario.usuarioId = this.usuarioIdUpdate;  
      this.usuarioService.updateUsuario(usuario).subscribe(() => {  
        this.dataSaved = true;  
        this._snackBar.open('Registro atualizado com sucesso !!!', 'Fechar')   
        this.loadAllUsuarios();  
        this.resetForm();
      });  
    }  
  } 

  loadUsuarioToEdit(usuarioId: number) {  
    this.usuarioService.getUsuarioById(usuarioId).subscribe(usuario=> {  
      this.pageTitle = "Editar Usuario";  
      this.dataSaved = false;  
      this.usuarioIdUpdate = usuario.usuarioId;  
      this.usuarioForm.controls['Id'].setValue(usuario.usuarioId);  
      this.usuarioForm.controls['Nome'].setValue(usuario.nome);  
      this.usuarioForm.controls['Email'].setValue(usuario.email);  
      this.usuarioForm.controls['Sexo'].setValue(usuario.sexo);  
      this.usuarioForm.controls['Senha'].setValue(usuario.senha); 
      this.usuarioForm.controls['DataNascimento'].setValue(usuario.dataNascimento);  
      this.usuarioForm.controls['Ativo'].setValue(usuario.ativo);  
    });    
  }

  deleteUsuario(usuarioId: number) {  
    if (confirm("Deseja realmente deletar este aluno ?")) {   
      this.usuarioService.deleteUsuarioById(usuarioId).subscribe(() => {  
        this.dataSaved = true;  
        this.message = 'Registro deletado com sucesso';  
        this._snackBar.open('Registro deletado com sucesso !!!', 'Fechar') 
        this.loadAllUsuarios();  
        this.resetForm(); 
      });  
    }  
  }
  
  resetForm() {  
    this.usuarioForm.reset();
    this.usuarioIdUpdate = 0;  
    this.pageTitle = "Cadastrar Usuario";  
    this.dataSaved = false;  
  } 

}

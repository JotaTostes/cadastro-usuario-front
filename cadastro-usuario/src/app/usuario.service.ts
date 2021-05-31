import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { Usuario } from './usuario'; 
import { Sexo } from './Sexo/sexo'; 

var httpOptions = {headers: new HttpHeaders({"Content-Type": "application/json"})};
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = 'https://localhost:5001/api/v1.0/Usuario';
  urlSexo = 'https://localhost:5001/api/v1.0/Sexo';

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<Usuario[]> {  
      return this.http.get<Usuario[]>(this.url);  
    }
  
  getAllSexo(): Observable<Sexo[]> {  
    return this.http.get<Sexo[]>(this.urlSexo);  
  } 
  getUsuarioById(usuarioId: number): Observable<Usuario> {  
    const apiurl = `${this.url}/id/${usuarioId}`;
    return this.http.get<Usuario>(apiurl);  
  } 
  createUsuario(usuario: Usuario): Observable<Usuario> {  
    return this.http.post<Usuario>(this.url, usuario, httpOptions);  
  }  
  updateUsuario(usuario: Usuario): Observable<Usuario> {  
    // const apiurl = `${this.url}/${usuario}`;
    return this.http.put<Usuario>(this.url,usuario, httpOptions);  
  }  
  deleteUsuarioById(usuarioId: number): Observable<number> {  
    const apiurl = `${this.url}/id/${usuarioId}`;
    return this.http.delete<number>(apiurl);  
  }  
}

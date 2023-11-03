import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as signalr from '@microsoft/signalr';
import { Formulario } from 'src/models/formulario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('Titulo') Titulo!: ElementRef;
  @ViewChild('Campo1') Campo1!: ElementRef;
  @ViewChild('Campo2') Campo2!: ElementRef;
  @ViewChild('Campo3') Campo3!: ElementRef;
  public formulario: Formulario = new Formulario();
  public userName: string = '';
  public connection = new signalr.HubConnectionBuilder()
    .withUrl("https://localhost:44313/form")
    .build();

  constructor() { }
  public ngOnInit(): void {
    this.startConnection();
  }

  public startConnection() {
    this.connection.on("updateForm", (userName: string, formulario: Formulario) => {
      // this.formulario = formulario;
      this.userName = userName;


      this.Titulo.nativeElement.value = formulario.Titulo;
      this.Campo1.nativeElement.value = formulario.Campo1;
      this.Campo2.nativeElement.value = formulario.Campo2;
      this.Campo3.nativeElement.value = formulario.Campo3;
    });

    this.connection.start();
  }

  public sendForm() {
    const ENVIAR = new Formulario();
    ENVIAR.Titulo = this.Titulo.nativeElement.value;
    ENVIAR.Campo1 = this.Campo1.nativeElement.value;
    ENVIAR.Campo2 = this.Campo2.nativeElement.value;
    ENVIAR.Campo3 = this.Campo3.nativeElement.value;
    this.connection.send("updateForm", this.userName, ENVIAR);
  }
}

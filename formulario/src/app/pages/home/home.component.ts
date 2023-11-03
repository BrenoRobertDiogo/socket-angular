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
  public userName: string = 'Breno teste';
  public mensagens: string[] = [];
  public connection = new signalr.HubConnectionBuilder()
    .withUrl("https://localhost:44313/form")
    .build();

  constructor() { }
  public ngOnInit(): void {
    this.startConnection();
  }

  public async startConnection() {
    this.connection.on("updateForm", (userName: string, formulario: Formulario) => {
      // this.formulario = formulario;
      console.log(userName);
      console.log(formulario);

      // this.userName = userName;


      this.Titulo.nativeElement.value = formulario.titulo;
      this.Campo1.nativeElement.value = formulario.campo1;
      this.Campo2.nativeElement.value = formulario.campo2;
      this.Campo3.nativeElement.value = formulario.campo3;
    });

    this.connection.on("newMessage", (userName: string, message: string) => {
        this.mensagens.push(message);
    })
    this.connection.start();

  }

  public async sendForm() {
    const ENVIAR = new Formulario();
    ENVIAR.titulo = this.Titulo.nativeElement.value;
    ENVIAR.campo1 = this.Campo1.nativeElement.value;
    ENVIAR.campo2 = this.Campo2.nativeElement.value;
    ENVIAR.campo3 = this.Campo3.nativeElement.value;
    await this.connection.send("updateForm", this.userName, ENVIAR);
    // await this.connection.send("updateForm", this.userName);// , ENVIAR
  }
  /**
   * sendMessage
   */
  public async sendMessage() {
    await this.connection.send("newMessage", this.userName, this.Titulo.nativeElement.value)
    // .then(() => {
    //   console.log(this.mensagens);

    // });
  }


}

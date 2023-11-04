import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as signalr from '@microsoft/signalr';
import { Utils } from 'src/app/utils/utils';
import { Connections } from 'src/enums/connections.enum';
import { Formulario } from 'src/models/formulario.model';
import { User } from 'src/models/user.model';

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
  @ViewChild('CampoNomeUsuario') CampoNomeUsuario!: ElementRef;
  public formulario: Formulario = new Formulario();
  public user!: User;
  public pessoasConectadas: User[] = [];
  public connection = new signalr.HubConnectionBuilder()
    .withUrl("https://localhost:44313/form")
    .build();

  public mensagemLogs: string[] = [];

  public campoNomeUsuarioDisabled: boolean = false;

  constructor() { }
  public ngOnInit(): void {
    this.startConnection();
  }

  public async startConnection() {
    this.connectUpdateForm();
    this.connectUpdateUserData();
    this.connectNewUser();

    this.connection.start().then(_ => {
      this.user = {
        id: Utils.getRndInteger(0, 100000),
        nome: 'Novo usuário'
      }
      this.sendNewUser(this.user);
    });
  }

  private async connectUpdateForm() {
    this.connection.on(Connections.UpdateForm, (userName: string, formulario: Formulario) => {
      this.Titulo.nativeElement.value = formulario.titulo;
      this.Campo1.nativeElement.value = formulario.campo1;
      this.Campo2.nativeElement.value = formulario.campo2;
      this.Campo3.nativeElement.value = formulario.campo3;
    });
  }

  private connectUpdateUserData() {
    this.connection.on(Connections.UpdateUserData, (user: User) => {
      // this.pessoasConectadas.push(user.nome);
      var indexUserUpdated = this.pessoasConectadas.findIndex(u => u.id === user.id);
      // Caso não tenha sido encontrado o index, insere esse usuário na lista
      if (indexUserUpdated === -1)
      this.pessoasConectadas.push(user);
      indexUserUpdated = this.pessoasConectadas.findIndex(u => u.id === user.id);


      const nomeAntigo = this.pessoasConectadas[indexUserUpdated].nome;
      this.pessoasConectadas[indexUserUpdated] = user;

      this.mensagemLogs.push(`O usuário ${nomeAntigo} alterou o nome para ${user.nome}`);
      console.log(this.pessoasConectadas);

    })
  }
  private connectNewUser() {
    this.connection.on(Connections.NewUserConnected, (user: User) => {
      this.mensagemLogs.push(`${user.nome} adicionado ao chat.`);
      this.pessoasConectadas.push(user);
      console.log(this.pessoasConectadas);

    })
  }

  private async sendNewUser(user: User) {
    await this.connection.send(Connections.NewUserConnected, user)
  }

  public async sendForm() {
    const ENVIAR = new Formulario();
    ENVIAR.titulo = this.Titulo.nativeElement.value;
    ENVIAR.campo1 = this.Campo1.nativeElement.value;
    ENVIAR.campo2 = this.Campo2.nativeElement.value;
    ENVIAR.campo3 = this.Campo3.nativeElement.value;
    await this.connection.send(Connections.UpdateForm, this.user, ENVIAR);
    // await this.connection.send("updateForm", this.userName);// , ENVIAR
  }
  /**
   * sendUserUpdate
   */
  public async sendUserUpdate() {
    this.user.nome = this.CampoNomeUsuario.nativeElement.value;
    await this.connection.send(Connections.UpdateUserData, this.user)
  }
}

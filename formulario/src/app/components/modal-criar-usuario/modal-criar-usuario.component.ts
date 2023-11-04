import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-criar-usuario',
  templateUrl: './modal-criar-usuario.component.html',
  styleUrls: ['./modal-criar-usuario.component.css']
})
export class ModalCriarUsuarioComponent {
  @Input({ required: true }) idModal!: string;
}

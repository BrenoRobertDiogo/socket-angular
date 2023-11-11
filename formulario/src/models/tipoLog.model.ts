import { TipoLogEnum } from "src/enums/tipoLog.enum";
import { User } from "./user.model";

export class Log {
  public TipoLog!: TipoLogEnum;
  public Mensagem!: string;
  public Usuario!: User;
}

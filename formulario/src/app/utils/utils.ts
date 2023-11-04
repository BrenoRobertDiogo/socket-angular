export class Utils {
  /**
   *
   * @param min Número mínimo aleatório
   * @param max Número máximo aleatório
   * @returns Um número entre 'min' e 'max'
   */
  public static getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
}

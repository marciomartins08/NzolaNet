
//calcular data
export function calcularTempoPublicacao(data: Date): string {
    const agora = new Date();
    const diferenca = agora.getTime() - new Date(data).getTime();
    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) {
      return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    } else if (horas > 0) {
      return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (minutos > 0) {
      return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else {
      return `Há ${segundos} segundo${segundos > 1 ? 's' : ''}`;
    }
}
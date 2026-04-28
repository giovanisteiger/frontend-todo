import { Component, signal } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('TODOapp');

  // ✅ AGORA É SÓ SIGNAL (sem duplicação)
  arrayDeTarefas = signal<Tarefa[]>([]);

  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://api-tarefas-cksj.onrender.com';
    this.READ_tarefas();
  }

  // ✅ CREATE usando signal
  CREATE_tarefa(descricaoNovaTarefa: string) {
    const novaTarefa = new Tarefa(descricaoNovaTarefa, false);

     this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe(
      resultado => { console.log(resultado); this.READ_tarefas(); });
  }

  // ✅ READ usando set
  READ_tarefas() {
     this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe(
      resultado => this.arrayDeTarefas.set(resultado));
  }

  // ✅ DELETE usando update + filter
removerTarefa(tarefa: Tarefa) {
  this.http.delete<Tarefa>(`${this.apiURL}/delete/${tarefa._id}`)
    .subscribe({
      next: (resultado) => {
        console.log("Tarefa removida:", resultado);
        this.READ_tarefas(); // atualiza a lista
      },
      error: (erro) => {
        console.error("Erro ao remover tarefa:", erro);
      }
    });
}

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserModificada); 
    var id = this.arrayDeTarefas()[indice]._id;                      
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
      tarefaAserModificada).subscribe(
        resultado => { console.log(resultado); this.READ_tarefas(); });
  }

}

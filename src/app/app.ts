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

  arrayDeTarefas = signal<Tarefa[]>([]);

  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://api-tarefas-cksj.onrender.com';
    this.READ_tarefas();
  }

  // CREATE
  CREATE_tarefa(descricaoNovaTarefa: string) {
    const novaTarefa = new Tarefa(descricaoNovaTarefa, false);

    this.http.post<Tarefa>(`${this.apiURL}/post`, novaTarefa)
      .subscribe(resultado => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }

  // READ
  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/getAll`)
      .subscribe(resultado => this.arrayDeTarefas.set(resultado));
  }

  // DELETE
  removerTarefa(tarefa: Tarefa) {
    this.http.delete<Tarefa>(`${this.apiURL}/delete/${tarefa._id}`)
      .subscribe({
        next: (resultado) => {
          console.log("Tarefa removida:", resultado);
          this.READ_tarefas();
        },
        error: (erro) => {
          console.error("Erro ao remover tarefa:", erro);
        }
      });
  }

  // UPDATE
  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    this.http.patch<Tarefa>(`${this.apiURL}/update/${tarefaAserModificada._id}`, tarefaAserModificada)
      .subscribe(resultado => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }
}

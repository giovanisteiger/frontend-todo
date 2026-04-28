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

  CREATE_tarefa(descricaoNovaTarefa: string) {
    const novaTarefa = new Tarefa(descricaoNovaTarefa, false);

    this.http.post<Tarefa>(`${this.apiURL}/post`, novaTarefa)
      .subscribe(resultado => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/getAll`)
      .subscribe(resultado => this.arrayDeTarefas.set(resultado));
  }

  removerTarefa(tarefa: Tarefa) {
    this.http.delete<Tarefa>(`${this.apiURL}/delete/${tarefa._id}`)
      .subscribe(resultado => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }

  UPDATE_tarefa(tarefa: Tarefa) {
    this.http.patch<Tarefa>(`${this.apiURL}/update/${tarefa._id}`, tarefa)
      .subscribe(resultado => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }
}

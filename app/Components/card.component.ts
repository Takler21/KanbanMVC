import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import {Observable} from "rxjs";
import {CardList} from "../models/cardlist-info";
import {Card} from "../models/card-info";
import {Task} from "../models/task-info";
import { Global } from '../Shared/global';
import { UserService } from "../Service/user.service";

@Component({
    selector: 'card',
    templateUrl: 'app/Components/card.component.html',
    styleUrls: ['app/Styles/card.component.css']
})
export class CardComponent implements OnInit {
   
    @Input() item: Card;
    tasks : Task[]
    msg: any;
    newtaskdesc: string;


    constructor(private _userService: UserService) {
        //console.log(this.item);
    }

    ngOnInit() {
        //console.log(this.item);
        this.loadTasks();
    }

    loadTasks() {
        this._userService.get(Global.BASE_TASKS_ENDPOINT)
            .subscribe(c => {
                this.tasks = c.filter((tasks: any) => tasks.cardId == this.item.Id);
            });
    }

    addNewTask(){
        //console.log('Add new subtask!');
        let newTask = new Task();
        newTask.created_at = new Date().toString().trim();
        console.log(newTask.created_at);
        this._userService.post(Global.BASE_TASKS_ENDPOINT, { cardId: this.item.Id, description: this.newtaskdesc, isCompleted: false, orders: 0, created_at: "Hoy" }).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "El departamento se ha actualizado exitosamente.";
                    console.log(this.msg);
                }
                else {
                    this.msg = "Hay problemas para guardar los datos!";
                    console.log(this.msg);
                }
            },
            error => {
                this.msg = error;
            },
            () => { this.loadTasks(); this.newtaskdesc = ""; }
        )
            
        //this.exportService.getJsonExport();
    }
    //elimina la tarea de la carta
    deleteTask(task: Task){
        //console.log(task);
        console.log(typeof (task.Id) + "   -   " + task.Id);
        this._userService.delete(Global.BASE_TASKS_ENDPOINT, task.Id).subscribe(() => { this.loadTasks() });
        //this.childModal.show();
    }

    
    //Cambia el estado de la tarea si esta incompleta a completa y viceversa
    changeTaskCompleted(task: Task){
        console.log(task);
        let taskAux = task;
        //taskAux.isCompleted = !taskAux.isCompleted;
        this._userService.put(Global.BASE_TASKS_ENDPOINT, task.Id, task).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Se completo Correctamente.";

                }
                else {
                    this.msg = "No Se completo Correctamente."
                }
            },
            error => {
                this.msg = error;
            },
            () => {
                console.log(this.msg + " Sub car");
                
            });
    }
    ////////////////////////////
    //Aqui primera intervencion.
    ////////////////////////////
    clickCarret(){
        this.item.isExpanded = !this.item.isExpanded;
        this._userService.put(Global.BASE_CARDS_ENDPOINT, this.item.Id, this.item).subscribe();
    }
}

import { Component } from "@angular/core"
import { UserComponent } from './components/user.component';

@Component({
    selector: "user-app",
    template: `
               <!--<div>
                  <nav class='navbar navbar-inverse'>
                       <div class='container-fluid'>
                         <ul class='nav navbar-nav'>
                           <li><a [routerLink]="['user']">Usuarios</a></li>
                           <li><a [routerLink]="['kanban']">Departamentos</a></li>
                      </ul>
                      </div>
                 </nav>-->   
              <div class='container'>
                <router-outlet></router-outlet>
              </div>
             <!--</div>-->        
`
})

export class AppComponent {

}
import { Component } from '@angular/core';
import { NotesComponent } from './notes';
import { NotesDataService } from './notes';
import { NotesServiceServerFirstOnAdd } from './notes';
import { NotesServiceStoreFirstOnAddClientId } from './notes';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [NotesComponent],
  providers: [NotesDataService, NotesServiceServerFirstOnAdd, NotesServiceStoreFirstOnAddClientId]
})
export class AppComponent {
  title = 'Angular2 State Management Demo';
}
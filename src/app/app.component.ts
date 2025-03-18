import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthEffects } from './auth/store/auth.effects';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [AuthEffects],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'school-mngr';
}

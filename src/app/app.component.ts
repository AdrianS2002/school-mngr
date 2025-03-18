import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthEffects } from './auth/store/auth.effects';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  providers: [AuthEffects],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'school-mngr';
}

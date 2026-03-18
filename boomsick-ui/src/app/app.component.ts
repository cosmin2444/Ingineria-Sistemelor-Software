import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. Import it

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 2. Add it here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'boomsick-ui';
}

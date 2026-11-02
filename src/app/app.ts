import { Footer } from './Layout/footer/footer';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Layout/navbar/navbar';
import { Theme } from './Core/Services/theme/theme';
import { Language } from './Core/Services/language/language';

@Component({
  imports: [RouterOutlet, Footer, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  // Created at start-up so the saved theme + language are applied on every page,
  // not only after the navbar happens to be rendered.
  private readonly theme = inject(Theme);
  private readonly language = inject(Language);

}

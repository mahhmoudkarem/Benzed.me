import {
  Component,
  inject,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Language } from '../../Core/Services/language/language';


@Component({
  selector: 'app-footer',
  standalone: true,

  imports: [
    RouterLink,
  ],

  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  readonly languageService =
    inject(Language);


  get currentLanguage() {
    return this.languageService.currentLanguage();
  }


  readonly currentYear =
    new Date().getFullYear();

}
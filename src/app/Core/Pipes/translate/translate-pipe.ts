import {
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { Language } from '../../Services/language/language';


@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {

  private readonly languageService =
    inject(Language);


  transform(
    english: string,
    arabic: string
  ): string {

    return this.languageService.isArabic()
      ? arabic
      : english;
  }

}
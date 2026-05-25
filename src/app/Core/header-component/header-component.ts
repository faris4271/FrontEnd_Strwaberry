import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, CommonModule,TranslateModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-100%)',
        opacity: 0,
      })),
      state('*', style({
        transform: 'translateY(0%)',
        opacity: 1,
      })),
      transition('void => *', animate('300ms ease-in')),
      transition('* => void', animate('300ms ease-out')),
    ]),
  ],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  isMenuOpen = false;
  currentUser$ = this.authService.currentUser$;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}

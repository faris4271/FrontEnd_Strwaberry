import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-component',
  imports: [RouterLink, ReactiveFormsModule,TranslateModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.log(email + ' ' + password);
          this.toastr.error(this.translate.instant('login.error.loginFailed') + ': ' + error.message);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register-component',
  imports: [RouterLink, ReactiveFormsModule,TranslateModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    country: [''],
    phoneNumber: [''],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,}$')]],
    confirmPassword: ['', Validators.required],
    agreeToTerms: [false, Validators.requiredTrue]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const { fullName, userName, email, address, country, phoneNumber, password, confirmPassword } = this.registerForm.value;

       if (password !== confirmPassword) {
         this.toastr.error(this.translate.instant('register.error.passwordMismatch'));
         return;
       }


      this.authService.register({
        fullName: fullName!,
        userName: userName!,
        email: email!,
        address: address || undefined,
        country: country || undefined,
        phoneNumber: phoneNumber || undefined,
        password: password!,
        confirmPassword: confirmPassword!
      }).subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.toastr.success(this.translate.instant('register.success'));
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(this.translate.instant('register.failed') + ': ' + (response.message || this.translate.instant('register.error.unknown')));
          }
        },
        error: (error) => {
          this.toastr.error(this.translate.instant('register.failed') + ': ' + (error.error?.message || error.message || this.translate.instant('register.error.unexpected')));
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

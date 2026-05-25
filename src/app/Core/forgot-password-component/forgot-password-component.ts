import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { ApiResponse } from '../../Models/api-response.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,TranslateModule],
  templateUrl: './forgot-password-component.html',
  styleUrls: ['./forgot-password-component.css']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  step = 1; // 1: Email, 2: Code, 3: New Password
  email = '';
  code = '';
  message = '';
  isError = false;
  isLoading = false;

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  confirmCodeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
  }

  sendCode() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true;
    this.email = this.forgotPasswordForm.value.email!;

    this.authService.sendResetPasswordCode({ email: this.email }).subscribe({
      next: (res) => {
        this.message = this.translate.instant('forgotPassword.messages.codeSent');
        this.isError = false;
        this.step = 2;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = this.translate.instant('forgotPassword.messages.sendFailed');
        this.isError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmCode() {
    if (this.confirmCodeForm.invalid) return;

    this.isLoading = true;
    this.code = this.confirmCodeForm.value.code!;

    this.authService.confirmResetPasswordCode({ email: this.email, code: this.code }).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.message = this.translate.instant('forgotPassword.messages.codeVerified');
          this.isError = false;
          this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: this.code } });
        } else {
          this.message = res.message || this.translate.instant('forgotPassword.messages.invalidCode');
          this.isError = true;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = this.translate.instant('forgotPassword.messages.invalidCode');
        this.isError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    if (this.step === 2) this.step = 1;
    this.message = '';
  }
}

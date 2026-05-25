import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './reset-password-component.html',
  styleUrls: ['./reset-password-component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);

  email = '';
  code = '';
  message = '';
  isError = false;
  isLoading = false;

  resetPasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,}$')]],
    confirmPassword: ['', Validators.required]
  });

  constructor() {
    this.resetPasswordForm.addValidators(this.passwordMatchValidator);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';

      if (!this.email || !this.code) {
        this.message = this.translate.instant('resetPassword.messages.invalidRequest');
        this.isError = true;
        this.toastr.error(this.message);
        setTimeout(() => this.router.navigate(['/forgot-password']), 3000);
      }
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const group = control as FormGroup;
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) return;

    this.isLoading = true;
    const { newPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword({
      email: this.email,
      code: this.code,
      Password: newPassword!
    }).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.message = this.translate.instant('resetPassword.messages.success');
          this.isError = false;
          this.isLoading = false;
          this.toastr.success(this.message);
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          this.message = res.message || this.translate.instant('resetPassword.messages.failed');
          this.isError = true;
          this.isLoading = false;
          this.toastr.error(this.message);
        }
      },
      error: (err) => {
        this.message = this.translate.instant('resetPassword.messages.failed');
        this.isError = true;
        this.isLoading = false;
        this.toastr.error(this.message);
      }
    });
  }
}
import { Routes } from '@angular/router';
import { LoginComponent } from './Core/login-component/login-component';
import { RegisterComponent } from './Core/register-component/register-component';
import { ForgotPasswordComponent } from './Core/forgot-password-component/forgot-password-component';
import { ResetPasswordComponent } from './Core/reset-password-component/reset-password-component';
import { HomeComponent } from './Components/home-component/home-component';
import { UploadImageComponent } from './Components/upload-image-component/upload-image-component';
import { AboutUsComponent } from './Components/about-us-component/about-us-component';
import { BlogComponent } from './Components/blog-component/blog-component';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "home", component: HomeComponent },
    { path: "", redirectTo: "home", pathMatch: 'full' },
    { path: "login", component: LoginComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "reset-password", component: ResetPasswordComponent },
    { path: "upload", component: UploadImageComponent, canActivate: [authGuard] },
    { path: "about", component: AboutUsComponent },
    { path: "blog", component: BlogComponent },
    { path: "**", redirectTo: "home", pathMatch: 'full' },
];

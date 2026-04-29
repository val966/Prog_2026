import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import { NgValidationError } from '@angular/forms/signals';
import {AbstractControl, FormGroup, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: FormGroup;
  submitted = false; //флаг, пользователь нажал кнопку "зарегестрироваться".
                     //Нужен, чтобы показать ошибки валидации после попытки отправки, а не при открытии страницы.
  showPassword = false; //флаг, показывать ли пароль или нет для иконки в шаблоне
  submitting = false; //флаг, идет ли сейчас отправка данных на сервер
  errorMessage: string | null = null; //сообщение об ошибке от сервера, если регистрация не удалась

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator});
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const g = control as FormGroup;
    const password = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;

    if( !password || !confirm) return null; //если одно из полей пустое, не показываем ошибку "пароли не совпадают"
    return password === confirm ? null : { mismatch: true };
  }

  get f(){
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    // console.log("Register: ", this.form.value);

    const {name, email, password} = this.form.value;
    this.submitting = true;
    this.auth
      .register({name, email, password})
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (res) => {
          this.auth.setSession(res);
          this.router.navigate(['/']);
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}

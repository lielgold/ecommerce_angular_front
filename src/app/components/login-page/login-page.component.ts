import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.module';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule,],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  sharedService = inject(SharedService);
  loginForm: FormGroup;
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registrationForm = this.formBuilder.group({
      reg_username: ['', Validators.required],
      reg_password: ['', Validators.required],
      reg_retypePassword: ['', Validators.required]
    });      
  }

  // Login user their account
  login(): void {
    if (this.loginForm.valid) {
      this.sharedService.login(this.loginForm.value.username, this.loginForm.value.password);
      // Reset the login form after submission
      this.loginForm.reset();
    }
  }

  // Register new account
  register():void{
    if (this.registrationForm.valid) {
      this.sharedService.register(this.registrationForm.value.reg_username, this.registrationForm.value.reg_password, this.registrationForm.value.reg_retypePassword);
      // Reset the login form after submission
      this.registrationForm.reset();
    }
  }


  

}

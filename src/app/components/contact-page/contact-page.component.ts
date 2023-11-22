import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BACK_URL, SharedService } from '../../shared.module';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  contactForm: FormGroup;
  sharedService = inject(SharedService);

  constructor(private httpClient: HttpClient, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {      
      //console.log('Form submitted:', this.contactForm.value);
      const formData = this.contactForm.value;

      // Implement your logic to handle form submission
      this.httpClient.post(BACK_URL + '/contact_us/', formData).subscribe(
        (data) => {
          //console.log('Feedback sent successfully:', data);                    
          this.sharedService.showAlert("Feedback submitted", "Thanks!", "success");
        },
        (error) => {
          //console.error('Error sending feedback:', error);
          this.sharedService.showAlert("Error sending feedback", "", "warning");
        }
      );
    }
  }
}


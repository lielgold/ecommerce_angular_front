import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit{
  title:string;
  message:string;
  alertType:string;

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string, alertType: 'warning' | 'information' | 'success' }) {
      this.title = data.title;
      this.message = data.message;  
      this.alertType = data.alertType; 
             
      // Set initial position here
      this.dialogRef.updatePosition({
        bottom: '20px',
        left: '50%',
      });      
    }
    

    ngOnInit(): void {
      // Automatically close the dialog after 5000 milliseconds (adjust as needed)
      setTimeout(() => {
        this.close();
      }, 5000);
    }    

  close(): void {
    this.dialogRef.close();
  }
}

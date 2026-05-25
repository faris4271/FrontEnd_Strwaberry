# Email Service Endpoints

Base URL: `https://localhost:7001/api/EmailsRoute`

## Overview
Email service endpoints for sending emails. Available to Admin and User roles.

---

## 1. Send Email
**POST** `/SendEmail`

Sends an email. Requires authentication.

### Request Body
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content",
  "isHtml": false
}
```

### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | string (email) | Yes | Recipient email address |
| `subject` | string | Yes | Email subject line |
| `body` | string | Yes | Email body content |
| `isHtml` | boolean | No | Set to `true` for HTML emails (default: `false`) |

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Email sent successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid email data (missing required fields, invalid email format)
- **403 Forbidden**: Insufficient permissions

---

## Angular Integration

### Using EmailService
```typescript
// Inject the service
constructor(private emailService: EmailService) {}

// Send a plain text email
sendTextEmail() {
  const request: SendEmailRequest = {
    to: 'recipient@example.com',
    subject: 'Hello from SchoolProject',
    body: 'This is a plain text email message.'
  };
  
  this.emailService.sendEmail(request).subscribe({
    next: (response) => {
      if (response.succeeded) {
        console.log('Email sent successfully!');
      }
    },
    error: (error) => console.error('Failed to send email', error)
  });
}

// Send an HTML email
sendHtmlEmail() {
  const request: SendEmailRequest = {
    to: 'recipient@example.com',
    subject: 'HTML Email',
    body: '<h1>Hello!</h1><p>This is an HTML email.</p>',
    isHtml: true
  };
  
  this.emailService.sendEmail(request).subscribe({
    next: (response) => {
      if (response.succeeded) {
        console.log('HTML email sent!');
      }
    },
    error: (error) => console.error('Failed to send email', error)
  });
}
```

### Email Component Example
```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../Services/email.service';
import { SendEmailRequest } from '../../Models/email.models';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="emailForm" (ngSubmit)="onSubmit()">
      <div>
        <label>To:</label>
        <input formControlName="to" type="email" placeholder="recipient@example.com">
      </div>
      <div>
        <label>Subject:</label>
        <input formControlName="subject" type="text">
      </div>
      <div>
        <label>Body:</label>
        <textarea formControlName="body" rows="5"></textarea>
      </div>
      <div>
        <label>
          <input formControlName="isHtml" type="checkbox">
          HTML Email
        </label>
      </div>
      <button type="submit" [disabled]="emailForm.invalid">Send Email</button>
    </form>
  `
})
export class SendEmailComponent {
  private fb = inject(FormBuilder);
  private emailService = inject(EmailService);

  emailForm = this.fb.group({
    to: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    body: ['', Validators.required],
    isHtml: [false]
  });

  onSubmit() {
    if (this.emailForm.valid) {
      const request = this.emailForm.value as SendEmailRequest;
      this.emailService.sendEmail(request).subscribe({
        next: () => {
          alert('Email sent successfully!');
          this.emailForm.reset({ isHtml: false });
        },
        error: (error) => alert('Failed to send email: ' + error.message)
      });
    }
  }
}
```

---

## Error Handling

Common email sending errors:

| Error | Cause | Solution |
|-------|-------|----------|
| 400 - Invalid email format | Invalid `to` email address | Validate email format before sending |
| 400 - Missing required fields | Missing `to`, `subject`, or `body` | Ensure all required fields are provided |
| 403 - Forbidden | User not authenticated or insufficient permissions | Check user is logged in and has proper role |
| Network Error | API server unavailable | Check API server is running at configured URL |

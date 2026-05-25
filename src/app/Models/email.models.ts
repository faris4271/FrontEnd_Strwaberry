export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

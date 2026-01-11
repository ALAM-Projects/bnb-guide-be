// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY non è definito');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    try {
      await this.resend.emails.send({
        from: 'Supporto <onboarding@resend.dev>', // Poi userai il tuo dominio verificato
        to: email,
        subject: 'Recupero Password',
        html: `
          <h1>Richiesta di reset password</h1>
          <p>Hai richiesto di resettare la tua password. Clicca sul link qui sotto:</p>
          <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Resetta Password
          </a>
          <p>Il link scadrà tra 15 minuti.</p>
        `,
      });
    } catch (error) {
      console.error('Errore invio email:', error);
    }
  }
}

const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

class EmailService {
  constructor() {
    this.email = process.env.EMAIL_ADDRESS;
    this.username = process.env.EMAIL_USERNAME || this.email;
    this.password = process.env.EMAIL_PASSWORD;
    this.smtpHost = process.env.EMAIL_SMTP;
    this.imapHost = process.env.EMAIL_IMAP;

    if (this.smtpHost && this.username && this.password) {
        this.transporter = nodemailer.createTransport({
          host: this.smtpHost,
          port: 465, // Standard secure port
          secure: true,
          auth: {
            user: this.username,
            pass: this.password
          }
        });
    }
  }

  async sendEmail({ to, subject, text, html }) {
    if (!this.transporter) {
        console.log('Email transporter not configured, skipping send.');
        return { success: false, error: 'Not configured' };
    }

    const msg = {
      from: `"Autonomous A1" <${this.email}>`,
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    try {
      const info = await this.transporter.sendMail(msg);
      console.log('Email sent:', info.messageId);
      return { success: true, info };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  }

  async checkEmails() {
     if (!this.imapHost || !this.username || !this.password) {
        console.log('IMAP not configured, skipping check.');
        return [];
     }

     const config = {
        imap: {
            user: this.username,
            password: this.password,
            host: this.imapHost,
            port: 993,
            tls: true,
            authTimeout: 10000
        }
     };

     try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: [''],
            markSeen: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const processedEmails = [];

        console.log(`Found ${messages.length} unseen emails`);

        for (const message of messages) {
            const all = message.parts.find(part => part.which === '');

            const parsed = await simpleParser(all.body);

            processedEmails.push({
                from: parsed.from ? parsed.from.text : 'Unknown',
                subject: parsed.subject,
                text: parsed.text,
                date: parsed.date
            });
        }

        connection.end();
        return processedEmails;
     } catch (error) {
        console.error('Error checking emails:', error);
        return [];
     }
  }
}

module.exports = EmailService;

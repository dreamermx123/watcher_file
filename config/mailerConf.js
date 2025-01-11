
import { config } from "dotenv"
config()

export const mailConf = {
    pool: true,
    host: process.env.MAIL_HOST, //SMTP сервер
    port: Number(process.env.MAIL_PORT),        // для SMTP используется порт 587 или 465
    secure: false,     // для порта 465 установите true
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    emailFrom: process.env.MAIL_EMAIL_FROM,
    tls: {
        rejectUnauthorized: false
    }
}

console.log(mailConf)
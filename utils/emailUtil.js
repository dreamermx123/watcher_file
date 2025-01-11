import nodemailer from "nodemailer"
import { mailConf } from "../config/mailerConf.js";

const transporter = nodemailer.createTransport(mailConf);

export async function sendEmail(to, subject, text) {
    console.log('попытка отправить')
    try {
        const mailOptions = {
            from: `"Logger App" ${mailConf.emailFrom}`, // Адрес отправителя
            to, // Получатель
            subject, // Тема письма
            text, // Текст письма
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email отправлен: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Ошибка при отправке email:', error);
        throw error;
    }
}
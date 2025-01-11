import { sendEmail } from "../utils/emailUtil.js";

async function sendLogFileByEmail(logData) {
    console.log("111")
    try {
        // Указываем получателя email
        // const recipientEmail = req.body.email; // Получатель из тела запроса
        // if (!recipientEmail) {
        //     return res.status(400).json({ message: 'Не указан email получателя.' });
        // }

        // Формируем данные для отправки
        const subject = 'Логи приложения';
        const text = 'Во вложении находятся последние логи приложения.';

        // Отправляем email
        await sendEmail('qwe@qwe.com', subject, text + `\n${logData}`);

        // Логируем успешную отправку
        // logger.info(`Логи отправлены на email: ${recipientEmail}`);
        // res.status(200).json({ message: 'Логи отправлены успешно.' });
    } catch (error) {
        console.error(error)
        // logger.error('Ошибка при отправке email:', error);
        // res.status(500).json({ message: 'Ошибка при отправке email.', error: error.message });
    }
}

export default sendLogFileByEmail

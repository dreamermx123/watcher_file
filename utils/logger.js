import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Функция для добавления 3 часов ко времени
const addThreeHours = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 3); // Добавляем 3 часа
    return date.toISOString();
};

const transportOutLogs = new DailyRotateFile({
    filename: 'logs/out-%DATE%.log', // Имя файла с датой
    datePattern: 'YYYY-MM-DD',      // Формат даты для файлов
    zippedArchive: true,            // Сжимать старые логи
    maxSize: '20m',                 // Максимальный размер файла (20 MB)
    maxFiles: '14d',                // Хранить логи не более 14 дней
    level: 'info',                  // Логи уровня "info" и выше
    // sync: true,
})

const transportErrorLogs = new DailyRotateFile({
    filename: 'logs/errors-%DATE%.log', // Имя файла с датой
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5k',
    maxFiles: '30d', // Хранить логи ошибок 30 дней
    level: 'error',  // Логи только уровня "error"
    // sync: true,
    auditFile: 'logs/errors-audit.json'
})

// Определяем кастомные уровни логирования
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        success: 3, // Новый уровень для успешных задач
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        success: 'green', // Цвет для уровня success
    },
};

// Добавляем кастомные уровни и создаём логгер
const logger = winston.createLogger({
    levels: customLevels.levels, // Используем кастомные уровни
    level: 'info', // Устанавливаем минимальный уровень логирования
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            const adjustedTimestamp = addThreeHours(timestamp);
            const formattedMessage = stack ? `Error: ${message}\nStack: ${stack}` : message;
            return `${adjustedTimestamp} [${level.toUpperCase()}]: ${formattedMessage}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Логирование в консоль
        // Ротация общих логов
        transportOutLogs,
        transportErrorLogs,
        // Ротация логов ошибок

    ],


});





export default logger;
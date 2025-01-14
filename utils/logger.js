import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { listPath } from './filesPaths.js';
import path from 'path';
import fs from 'fs/promises';


/**
 * Функция вызывается при запуске наблюдателя
 * @returns 
 */
async function startLogs() {

    for (let i = 0; i < listPath.length; i++) {
        let folder = listPath[i]
        /**
         * путь к папке с логами в проекте
         */
        let pathFolderNormalize = path.normalize(folder)
        if (!path.isAbsolute(pathFolderNormalize)) {
            console.error(`Введен не абсолютный путь ${pathFolderNormalize}`)
            return null
        }
        //проверка на существование целевой папки
        try {
            await fs.access(pathFolderNormalize)
        } catch (error) {

            if (error?.code === "ENOENT") {
                console.log(`Директория ${pathFolderNormalize} отсуствует. Создаем директорию`)
                try {
                    await fs.mkdir(pathFolderNormalize)
                } catch {
                    console.error(`Ошибка при создании директории ${pathFolderNormalize}`)
                    throw error
                }
            } else {
                console.log(error)
                throw error
            }
        }

        const folderContents = await fs.readdir(pathFolderNormalize)
        try {
            /**
             * путь к папке со старыми логами
             */
            let folderOldLogs = path.join(pathFolderNormalize, "oldLogs")

            /**
             * целевая папка для перемещения логов 
             */
            let targetFolderLogs;

            if (!folderContents.includes("oldLogs")) {
                console.log("Папки со старыми логами не обнаружено, создаем папку oldLogs")
                await fs.mkdir(folderOldLogs)
            }

            const nametargetFolderOldLogs = new Date().toLocaleString('ru-RU').replace(/[^\w+]/g, '_')

            targetFolderLogs = path.join(folderOldLogs, nametargetFolderOldLogs),
                console.log(`создаем целевую папку для перемещения файлов ${targetFolderLogs}`)
            await fs.mkdir(targetFolderLogs)
            console.log('folderContents', folderContents, '\npathFolderNormalize', pathFolderNormalize)
            for (const name of folderContents) {

                if (name !== 'oldLogs') {
                    console.log('pathFolderNormalize', pathFolderNormalize, 'targetFolderLogs', targetFolderLogs)
                    await fs.rename(path.join(pathFolderNormalize, name), path.join(targetFolderLogs, name))
                }
            }

            const items = await fs.readdir(folderOldLogs, { withFileTypes: true });
            const folders = items.filter(item => item.isDirectory()).map(item => path.join(folderOldLogs, item.name));

            for (const folderPath of folders) {
                // Проверяем, пуста ли папка после обработки
                const remainingItems = await fs.readdir(folderPath);
                if (remainingItems.length === 0) {
                    await fs.rmdir(folderPath); // Удаляем папку, если она пуста
                    console.log(`Удалена пустая папка: ${folderPath}`);
                }
            }
            console.log()
        } catch (error) {
            console.log(error)
        }

    }
}

await startLogs()


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
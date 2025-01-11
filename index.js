import startFileWatcher from "./utils/fileWatcher.js";
import logger from "./utils/logger.js";

import path from 'path';
import { fileURLToPath } from 'url';
import fileModel from "./models/fileModel.js";
import fs from "fs/promises";
'use strict'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsPath = path.join(__dirname, 'logs')


const listPath = [
    logsPath,

]

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

            for (const name of folderContents) {
                if (name !== 'oldLogs') {
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


startFileWatcher(listPath)

// // logger.error('Error! Something went wrong.');
// // logger.info('Task 1 completed successfully!');
// // const { pathFile } = await fileModel.readLastFileInfo()
// // fileModel.readFileFromPosition(pathFile, 100)

setInterval(() => {

    try {
        qwe.eweq = qwe
    } catch (error) {
        logger.error("Error abrakadabra", error);
    }

}, 100)





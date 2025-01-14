import chokidar from 'chokidar';

import fileModel from '../models/fileModel.js';

// Путь к папке с логами
const logsDir = './../logs';




// Проверяем, существует ли папка логов, создаём её, если нет
// if (!fs.existsSync(logsDir)) {
//     fs.mkdirSync(logsDir);
//     console.log('Папка logs создана.');
// }

// Настраиваем наблюдатель



const startFileWatcher = (filePath) => {
    console.log(filePath)
    if (!Array.isArray(filePath)) {
        throw new Error("filePath is not Array")
    }

    const watcher = chokidar.watch('./logs', {
        ignored: (path, stats) => {
            return stats?.isFile() && !path.includes('errors') || path.includes('.gz')
        }, // only watch log files
        persistent: true, // Наблюдатель работает постоянно
        ignoreInitial: true, // Обрабатывать уже существующие файлы при старте
        // awaitWriteFinish: {
        //     stabilityThreshold: 500, // Ждём завершения записи файла (500 мс)
        //     pollInterval: 100,       // Интервал проверки
        // },
    });

    watcher
        .on('add', (path) => {
            console.log(`Файл добавлен: ${path}`);
            // readLogFile(path); // Читаем содержимое нового файла
        })
        .on('change', (path) => {
            console.log(`Файл изменён: ${path}`);

            fileModel.readFileFromPosition(path).then(() => {
                fileModel.lastFile()
            })
            // readLogFile(path); // Читаем изменения в файле
        })
        .on('unlink', (path) => {
            console.log(`Файл удалён: ${path}`);
        })
        .on('error', (error) => console.error(`Ошибка наблюдателя: ${error}`));
}

export default startFileWatcher;
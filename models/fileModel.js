import fs from "fs/promises"
import path, { dirname } from "path"
import { fileURLToPath } from 'url';
import sendLogFileByEmail from "../controllers/emailController.js";

class FilesModel {
    constructor() {

    }

    pathThisFile() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return __dirname
    }

    async readFileFromPosition(filePath) {
        if (!filePath) {
            throw new Error("not filePath")
        }

        if (typeof filePath !== "string") {
            throw new Error("filePath is not string")
        }

        const lastFileInfo = await this.readLastFileInfo()
        if (!lastFileInfo) {
            return null
        }
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;
        const startByte = Math.max(0, fileSize - (fileSize - lastFileInfo.size));
        const fileBuffer = await fs.readFile(filePath);
        const remainingBuffer = fileBuffer.slice(startByte);
        console.log('Остаток файла (строка):', remainingBuffer.toString('utf8'));
        sendLogFileByEmail(remainingBuffer.toString('utf8'))
    }

    async lastFile() {
        try {
            console.log('lastFile')
            const __dirname = this.pathThisFile();
            const pathDir = path.join(__dirname, '../logs')

            const filesDir = await fs.readdir(pathDir)

            const logFiles = filesDir.filter((name) => /errors/i.test(name) && !name.endsWith('.gz'));
            if (logFiles.length === 0) {
                console.log('Нет подходящих файлов в директории.');
                return null;
            }

            const fileStats = await Promise.all(
                logFiles.map(async (name) => {
                    const pathFile = path.join(pathDir, name);
                    const stats = await fs.stat(pathFile);
                    // console.log({
                    //     name,
                    //     creationTime: stats.birthtimeMs,
                    //     pathFile,
                    //     size: stats.size,
                    // })
                    return {
                        name,
                        creationTime: stats.birthtimeMs,
                        pathFile,
                        size: stats.size,
                    };
                })
            );

            const lastFile = fileStats.reduce((latest, current) => {
                return current.creationTime > latest.creationTime ? current : latest;
            });
            console.log('lastFile\n', lastFile, 'lastFile\n')
            await this.saveLastFileInfo(lastFile)

            return lastFile
        } catch (error) {
            console.error('Ошибка при поиске последнего файла:', error);
            throw error;
        }
    }

    async saveLastFileInfo(data) {
        try {
            const __dirname = this.pathThisFile();
            const pathFile = path.join(__dirname, '../logs', 'lastFileInfo.txt')
            console.log(data)
            await fs.writeFile(pathFile, JSON.stringify(data), 'utf8')
        } catch (error) {
            throw error
        }
    }

    async readLastFileInfo() {

        const __dirname = this.pathThisFile();
        const pathFile = path.join(__dirname, '../logs', 'lastFileInfo.txt')

        try {
            await fs.access(pathFile);
        } catch (error) {
            await fs.writeFile(pathFile, '')
        }
        try {
            const data = await fs.readFile(pathFile, 'utf8')

            if (!data) {
                return null
            }
            return JSON.parse(data)
        } catch (error) {
            throw error
        }
    }
}

export default new FilesModel()
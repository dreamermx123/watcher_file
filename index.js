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




startFileWatcher(listPath)

// // logger.error('Error! Something went wrong.');
// // logger.info('Task 1 completed successfully!');
// // const { pathFile } = await fileModel.readLastFileInfo()
// // fileModel.readFileFromPosition(pathFile, 100)

// setInterval(() => {

//     try {
//         qwe.eweq = qwe
//     } catch (error) {
//         logger.error("Error abrakadabra", error);
//     }

// }, 1000)





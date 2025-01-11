import fs from "fs";
import path from "path";

const logFilePath = path.resolve("logs", "application.log");

const saveLog = (logData) => {
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${logData}\n`);
};

export default {
    saveLog,
};
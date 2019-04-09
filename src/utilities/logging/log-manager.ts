import * as formatDate from "dateformat";

export default class LogManager {
    public static log(message: string) {
        console.log(`${formatDate(Date.now(), "isoDateTime")} [INFO] : ${message}`);
    }
}
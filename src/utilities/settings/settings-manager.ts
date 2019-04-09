import UserSettings from "./user-settings";
import * as settings from "electron-settings";
import { app } from "electron";
import * as path from "path";

export default class SettingsManager {

    private keys = {
        DOCUMENT_DIRECTORY: "EntryDirectory",
        ENCRYPT: "Encrypt",
        PASS_HASH: "PassHash"
    };

    private defaultStoragePath: string;

    constructor() {
        this.defaultStoragePath = path.join(app.getPath("documents"),"journal");
    }

    public getUserSettingsFilePath(): string {
        return settings.file();
    }

    public getUserSettings(): UserSettings {
        let userSettings = new UserSettings();
        userSettings.entryDirectory = settings.get(this.keys.DOCUMENT_DIRECTORY, this.defaultStoragePath) as string;
        userSettings.encrypt = settings.get(this.keys.ENCRYPT, false) as boolean;
        userSettings.passHash = settings.get(this.keys.PASS_HASH) as string;
        return userSettings;
    }

    public setUserSettings(userSettings: UserSettings): void{
        settings.set(this.keys.DOCUMENT_DIRECTORY, userSettings.entryDirectory);
        settings.set(this.keys.ENCRYPT, userSettings.encrypt);
        settings.set(this.keys.PASS_HASH, userSettings.passHash);
    }
}
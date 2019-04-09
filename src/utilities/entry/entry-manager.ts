import Entry from "./Entry";
import * as fs from "fs";
import * as formatDate from "dateformat";
import * as path from "path";
import SettingsManager from "../settings/settings-manager";
import LogManager from "../logging/log-manager";

export default class EntryManager {

    private dateFormat: string = "mm-dd-yyyy";
    private settingsManager: SettingsManager;

    constructor(userSettings: SettingsManager) {
        this.settingsManager = userSettings;
    }

    public async getEntryForToday(): Promise<Entry> {
        return this.getEntryForDate(Date.now());
    }

    public async saveEntry(entry: Entry): Promise<void> {
        LogManager.log("Saving Entry");
        // TODO: Write metadata
        return this.writeFileForDate(entry.dateCreated, entry.text); 
    }

    public async getEntryForDate(date: number): Promise<Entry>{
        
        LogManager.log(`Loading Entry for ${formatDate(date, this.dateFormat)}`);

        try {
            let text = await this.readFileForDate(date);
            let entry = new Entry();
            entry.text = text;

            if (entry.text == null || entry.text.length <= 0)
                return this.createEmptyEntryForDate(date);    

            //TODO: FIX! Parse data from file
            entry.dateCreated = date;
            entry.dateUpdated = date;
            return entry;
        }
        catch (err) {
            LogManager.log(`Loading Entry failed.`);

            return this.createEmptyEntryForDate(date);
        }
    }

    private async createEmptyEntryForDate(date: number): Promise<Entry> {
        LogManager.log(`Creating empty entry for ${formatDate(date, this.dateFormat)}`);

        try {
            await this.writeFileForDate(date, "");

            let entry = new Entry();
            entry.dateCreated = Date.now();
            entry.dateUpdated = Date.now();
            entry.text =
                `## ${formatDate(date, "ddd, mmm dS, yyyy")}\n\n*weather* : \n*location* : Home\n\n`;
            return entry;
        }
        catch (err){
            LogManager.log(`Error writing empty file for date ${formatDate(date, this.dateFormat)} : ${err}`);
            return null;
        }
    }

    private getFilePathPathForDate(date: string): string{
        if (date == null || date.length <= 0)
            throw ("Invalid arguments. Date required");
        
        let userSettings = this.settingsManager.getUserSettings();
        return path.join(userSettings.entryDirectory, date + ".md");
    }

    private async readFileForDate(date: number): Promise<string> {
        let formattedDate = formatDate(date, this.dateFormat);
        let filepath = this.getFilePathPathForDate(formattedDate);

        return new Promise<string>((resolve, reject) => {
          fs.readFile(filepath, "utf8", (err, data) => {
              err ? reject(err) : resolve(data);
          });
        });
    }
    
    private async writeFileForDate(date: number, text: string): Promise<void> {
        let formattedDate = formatDate(date, this.dateFormat);
        let filepath = this.getFilePathPathForDate(formattedDate);

        return new Promise<void>((resolve, reject) => {
            fs.writeFile(filepath, text, "utf8", (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
}
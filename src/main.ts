import { app, BrowserWindow, Menu, shell, ipcMain } from "electron";
import EntryManager from "./utilities/entry/entry-manager";
import SettingsManager from "./utilities/settings/settings-manager";
import Entry from "./utilities/entry/Entry";
import LogManager from "./utilities/logging/log-manager";
import UserSettings from "./utilities/settings/user-settings";
import { IpcMessages, IpcAppState } from "./utilities/ipc";
import MenuManager from "./utilities/menu-manager";

/**
 * Main Journal application class. Functions
 * to start up the electron application and wire
 * up window and app events.
 * 
 * @class Journal
 */
class Journal {

    private entryWindow: BrowserWindow;
    private settingsWindow: BrowserWindow;
    private entryManager: EntryManager;
    private settingsManager: SettingsManager;
    private menuManager: MenuManager;
    private currentEntry: Entry;

    constructor() {
        LogManager.log("Application Starting");

        this.menuManager = new MenuManager(
            () => this.openEntryWindow(),
            () => this.openSettingsWindow()
        );

        this.bindAppEvents();
    }

    /*--------------------------------*
    |           EVENT BINDING         |
    *---------------------------------*/

    /**
     * Handles binding all of the app specific events
     * 
     * @private
     * @memberof Journal
     */
    private bindAppEvents(): void {
        LogManager.log(" -- Binding App Events");

        app.on("window-all-closed", this.handleAllWindowsClosed.bind(this));
        app.on("ready", this.handleOnAppReady.bind(this));
    }

    /**
     * Handles binding all of the window events and wiring up
     * IPC message handlers from the window
     * 
     * @private
     * @memberof Journal
     */
    private bindWindowEvents(window : BrowserWindow): void {
        LogManager.log(" -- Binding Window Events");

        window.webContents.on("did-finish-load", () => {
            window.show();
            window.focus();
        });
    
        window.on("closed", () => {
            window = null;
        });
    }

    private bindIpcEvents(): void {
        ipcMain.on(IpcMessages.CLIENT_READY, this.onClientReady.bind(this));
        ipcMain.on(IpcMessages.ENTRY_SAVED, this.handleOnEntrySave.bind(this));
        ipcMain.on(IpcMessages.SETTINGS_SAVED, this.handleOnSettingsSave.bind(this));
    }

    /*--------------------------------*
    |          EVENT HANDLING         |
    *---------------------------------*/

    /**
     * Main handler for when the app is ready
     * 
     * @private
     * @memberof Journal
     */
    private async handleOnAppReady() {
        LogManager.log("Application Ready");

        this.menuManager.Initialize();

        this.settingsManager = new SettingsManager();
        LogManager.log(`Loading settings from: ${this.settingsManager.getUserSettingsFilePath()}`);

        this.entryManager = new EntryManager(this.settingsManager);
        this.currentEntry = await this.entryManager.getEntryForToday();

        LogManager.log("Client Starting");
        this.openEntryWindow();
        this.bindIpcEvents();
    }

    /**
     * Handles the Client Ready message from the window. This
     * indicates the client has loaded and is ready for data.
     * 
     * @private
     * @param {any} event 
     * @memberof Journal
     */
    private async onClientReady(event) {
        LogManager.log("Client Ready");

        let state = new IpcAppState();
        state.entry = this.currentEntry;
        state.settings = this.settingsManager.getUserSettings();

        event.sender.send(IpcMessages.STATE_LOADED, state);
    }

    /**
     * Handles the event from the window when the user saves their
     * entry
     * 
     * @private
     * @param {any} event 
     * @param {any} data 
     * @returns 
     * @memberof Journal
     */
    private async handleOnEntrySave(event, data) {
        if (!this.currentEntry) return;

        LogManager.log("User Initiated Entry Saving");
        this.currentEntry.dateUpdated = Date.now();
        this.currentEntry.text = data;
        this.entryManager.saveEntry(this.currentEntry);
    }

    /**
     * Handles the event from the window when the user saves their
     * settings
     * 
     * @private
     * @param {any} event 
     * @param {UserSettings} data 
     * @memberof Journal
     */
    private async handleOnSettingsSave(event, data: UserSettings) {
        LogManager.log("User Initiated Save Settings");

        this.settingsManager.setUserSettings(data);
    }

    /**
     * Handles the app event when all windows
     * are closed
     * 
     * @private
     * @memberof Journal
     */
    private handleAllWindowsClosed() {
        if (process.platform !== "darwin")
            app.quit();
    }

    private openSettingsWindow() {
        this.settingsWindow = null;
        this.settingsWindow = new BrowserWindow({
            show: false,
            width: 400,
            height: 300
        });

        this.settingsWindow.loadURL(`file://${__dirname}/settings-window.html`);
        this.bindWindowEvents(this.settingsWindow);
    }

    private async openEntryWindow() {
        this.currentEntry = await this.entryManager.getEntryForToday();

        this.entryWindow = null;
        this.entryWindow = new BrowserWindow({
            show: false,
            width: 600,
            height: 625,
            titleBarStyle: "hidden"
        });

        this.entryWindow.loadURL(`file://${__dirname}/entry-window.html`);
        this.bindWindowEvents(this.entryWindow);
    }
};

new Journal();
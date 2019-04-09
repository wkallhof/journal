import * as $ from "jquery";
import { ipcRenderer, ipcMain } from "electron"; 
import { IpcMessages, IpcAppState} from "./utilities/ipc";
import UserSettings from "./utilities/settings/user-settings";

let SELECTORS = {
    ENTRY_DIRECTORY_INPUT: ".js-entry-directory",
    ENTRY_DIRECTORY_VALUE: ".js-entry-directory-value",
    SETTINGS_SAVE_BUTTON: ".js-settings-save",
}

export default class SettingsWindow {

    private $settingsSaveButton: JQuery<HTMLElement>;
    private $entryDirectoryInput: JQuery<HTMLElement>;
    private $entryDirectoryValue: JQuery<HTMLElement>;

    constructor() {
        //map elements
        this.$settingsSaveButton = $(SELECTORS.SETTINGS_SAVE_BUTTON);
        this.$entryDirectoryInput = $(SELECTORS.ENTRY_DIRECTORY_INPUT);
        this.$entryDirectoryValue = $(SELECTORS.ENTRY_DIRECTORY_VALUE);

        //bind
        this.bindEvents();

        //message ready
        ipcRenderer.send(IpcMessages.CLIENT_READY);
    }

    private bindEvents() {
        ipcRenderer.on(IpcMessages.STATE_LOADED, this.onEntryLoaded.bind(this));
        this.$settingsSaveButton.on("click", this.onSettingsSaveClick.bind(this));
        this.$entryDirectoryInput.on("change", this.onEntryDirectoryChange.bind(this));
    }

    private onEntryDirectoryChange(e: JQuery.Event) {
        let input = this.$entryDirectoryInput.get(0) as HTMLInputElement;
        let val = input.files[0];
        this.$entryDirectoryValue.text(val.path);
    }

    private onEntryLoaded(event, state: IpcAppState) {
        this.$entryDirectoryValue.text(state.settings.entryDirectory);
    }

    private onSettingsSaveClick() {
        let settings = new UserSettings();
        settings.entryDirectory = this.$entryDirectoryValue.text();
        ipcRenderer.send(IpcMessages.SETTINGS_SAVED, settings);
    }
}

$(function () {
    new SettingsWindow();
})


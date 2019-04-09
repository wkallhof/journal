import * as SimpleMDE from "simplemde";
import * as $ from "jquery";
import { ipcRenderer, ipcMain } from "electron"; 
import { IpcMessages, IpcAppState} from "./utilities/ipc";
import UserSettings from "./utilities/settings/user-settings";
import debounce from "./utilities/debounce";
import LogManager from "./utilities/logging/log-manager";

let SELECTORS = {
    ENTRY_INPUT: "#journal-input"
}

export default class EntryWindow {

    private markdown: SimpleMDE;

    private $entryInput: HTMLElement;

    constructor() {
        //map elements
        this.$entryInput = $(SELECTORS.ENTRY_INPUT).get(0);

        //init markdown plugin
        this.markdown = new SimpleMDE({
            element: this.$entryInput,
            toolbar: false,
            spellChecker: false,
            status: false
        });

        //bind
        this.bindEvents();

        //message ready
        ipcRenderer.send(IpcMessages.CLIENT_READY);
    }

    private bindEvents() {
        ipcRenderer.on(IpcMessages.STATE_LOADED, this.onEntryLoaded.bind(this));
        this.markdown.codemirror.on("change", debounce(this.triggerSave.bind(this), 1000));
    }

    private onEntryLoaded(event, state: IpcAppState) {
        this.markdown.value(state.entry.text);
    }

    private triggerSave() {
        ipcRenderer.send(IpcMessages.ENTRY_SAVED, this.markdown.value());
    }
}

$(function () {
    new EntryWindow();
})


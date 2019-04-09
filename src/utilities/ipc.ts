import Entry from "./entry/entry";
import UserSettings from "./settings/user-settings";

export class IpcMessages {
    public static CLIENT_READY: string = "CLIENT_READY";
    public static ENTRY_SAVED: string = "ENTRY_SAVED";
    public static STATE_LOADED: string = "STATE_LOADED";
    public static SETTINGS_SAVED: string = "SETTINGS_SAVED";
}

export class IpcAppState {
    public entry: Entry;
    public settings: UserSettings;
}
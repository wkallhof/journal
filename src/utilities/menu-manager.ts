import { app, Menu, MenuItemConstructorOptions, MenuItem } from "electron";

export default class MenuManager{

    private openSettingsFunction: Function;
    private openTodaysEntryFunction: Function;
    private menuTemplate: MenuItemConstructorOptions[];

    constructor(openTodaysEntryFunction: Function, openSettingsFunction: Function) {
        this.openSettingsFunction = openSettingsFunction;
        this.openTodaysEntryFunction = openTodaysEntryFunction;

        this.menuTemplate = [
            {
                label: "Journal",
                submenu: [
                    { label: "Open Today's Entry", click: () => { this.openTodaysEntryFunction() } },
                    { type: 'separator' },
                    { label: "Settings", click: () => { this.openSettingsFunction() } },
                    { type: 'separator' },
                    { label: 'Quit', click: () => { app.quit(); }}
                ]
            },
            {
                label: 'Edit',
                submenu: [
                  { role: 'undo' },
                  { role: 'redo' },
                  { type: 'separator' },
                  { role: 'cut' },
                  { role: 'copy' },
                  { role: 'paste' },
                  { role: 'pasteandmatchstyle' },
                  { role: 'delete' },
                  { role: 'selectall' }
                ]
            },
            {
                label: 'View',
                submenu: [
                  {role: 'reload'},
                  {role: 'forcereload'},
                  {role: 'toggledevtools'},
                  {type: 'separator'},
                  {role: 'resetzoom'},
                  {role: 'zoomin'},
                  {role: 'zoomout'},
                  {type: 'separator'},
                  {role: 'togglefullscreen'}
                ]
              }
        ];
    }

    public Initialize() {
        const menu = Menu.buildFromTemplate(this.menuTemplate);
        Menu.setApplicationMenu(menu)
    }
}


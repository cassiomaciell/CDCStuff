/**
 * @name __PLUGIN_NAME__
 * @author __PLUGIN_AUTHOR__
 * @description __PLUGIN_DESCRIPTION__
 * @version __PLUGIN_VERSION__
 * @authorId __PLUGIN_AUTHORID__
 * @authorLink __PLUGIN_AUTHORLINK__
 */

//CPL __PLUGIN_INFO__

module.exports = class __PLUGIN_NAME__ {
    getPluginInfo() {
        return "__PLUGIN_INFO__";
    }
    getPluginName() {
        return "__PLUGIN_NAME__";
    }
    getPluginVersion() {
        return "__PLUGIN_VERSION__";
    }
    settings = {
        checkPluginUpdate: !!BdApi.getData(this.getPluginName(), "checkPluginUpdate"),
        incognitoEnable: !!BdApi.getData(this.getPluginName(), "incognitoEnable"),
        incognitoInvert: !!BdApi.getData(this.getPluginName(), "incognitoInvert"),
        incognitoChrome: !!BdApi.getData(this.getPluginName(), "incognitoChrome"),
        incognitoEdge: !!BdApi.getData(this.getPluginName(), "incognitoEdge"),
        incognitoFirefox: !!BdApi.getData(this.getPluginName(), "incognitoFirefox"),
        openInDiscordEnable: !!BdApi.getData(this.getPluginName(), "openInDiscordEnable"),
        openInDiscordMaximize: !!BdApi.getData(this.getPluginName(), "openInDiscord"),
    };
    events = {
        onClick: this.onClickEvent.bind(this),
    };
    load() {
        if (!global.ZeresPluginLibrary)
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${this.getPluginName()} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error)
                            return require("electron").shell.openExternal(
                                "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                            );
                        await new Promise((r) => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                },
            });
    }
    start() {
        if (this.settings.checkPluginUpdate) this.checkPluginUpdate();
        document.addEventListener("click", this.events.onClick);
        if (BdApi.getData(this.getPluginName(), this.getPluginName()) == undefined) {
            BdApi.setData(this.getPluginName(), this.getPluginName(), true);
            this.settings.incognitoEnable = true;
            this.settings.incognitoChrome = true;
            this.settings.openInDiscordEnable = true;
            this.settings.openInDiscordMaximize = true;
            this.settings.checkPluginUpdate = true;
            this.savePluginConfig();
        }
    }
    stop() {
        document.removeEventListener("click", this.events.onClick);
    }
    getSettingsPanel() {
        const settingsRoot = document.createElement("div");
        const settings = new ZLibrary.Settings.SettingGroup(`${this.getPluginName()} settings`, {
            collapsible: false,
            callback: () => {
                this.savePluginConfig();
            },
        });

        const checkPluginUpdate = new ZLibrary.Settings.Switch("Automatically check for updates?", null, this.settings.checkPluginUpdate, (e) => {
            this.settings.checkPluginUpdate = e;
        });

        settings.append(checkPluginUpdate);

        const incognitoSettings = new ZLibrary.Settings.SettingGroup("Incognito", { collapsible: true });
        const incognitoEnable = new ZLibrary.Settings.Switch("Enable", "Shift+Click to ignore", this.settings.incognitoEnable, (e) => {
            this.settings.incognitoEnable = e;
        });
        const incognitoInvert = new ZLibrary.Settings.Switch("Invert", "Shift+Click to open in incognito mode", this.settings.incognitoInvert, (e) => {
            this.settings.incognitoInvert = e;
        });
        const incognitoChrome = new ZLibrary.Settings.Switch("Chrome", null, this.settings.incognitoChrome, (e) => {
            this.settings.incognitoChrome = e;
        });
        const incognitoEdge = new ZLibrary.Settings.Switch("Microsoft Edge", null, this.settings.incognitoEdge, (e) => {
            this.settings.incognitoEdge = e;
        });
        const incognitoFirefox = new ZLibrary.Settings.Switch("Mozilla Firefox", null, this.settings.incognitoFirefox, (e) => {
            this.settings.incognitoFirefox = e;
        });
        incognitoSettings.append(incognitoEnable);
        incognitoSettings.append(incognitoInvert);
        incognitoSettings.append(incognitoChrome);
        incognitoSettings.append(incognitoEdge);
        incognitoSettings.append(incognitoFirefox);
        settings.append(incognitoSettings);

        const openInDiscord = new ZLibrary.Settings.SettingGroup("Open in Discord", { collapsible: true });
        const openInDiscordEnable = new ZLibrary.Settings.Switch("Enable", "Ctrl+Click to use", this.settings.openInDiscordEnable, (e) => {
            this.settings.openInDiscordEnable = e;
        });
        const openInDiscordMaximize = new ZLibrary.Settings.Switch("Maximize window", null, this.settings.openInDiscordMaximize, (e) => {
            this.settings.openInDiscordMaximize = e;
        });
        openInDiscord.append(openInDiscordEnable);
        openInDiscord.append(openInDiscordMaximize);
        settings.append(openInDiscord);

        settings.appendTo(settingsRoot);
        return settingsRoot;
    }
    savePluginConfig() {
        for (const key in this.settings) {
            BdApi.saveData(this.getPluginName(), key, this.settings[key]);
        }
    }
    checkPluginUpdate() {
        require("request").get("__PLUGIN_RAW__", async (error, response, body) => {
            if (error) {
                BdApi.showConfirmationModal(this.getPluginName(), `Unable to check for an update! Check manually?`, {
                    confirmText: "Yes",
                    cancelText: "Maybe later",
                    onConfirm: () => {
                        require("electron").shell.openExternal("__PLUGIN_PAGE__");
                    },
                });
                return;
            }
            const pluginInfo = JSON.parse(atob(body.match(/^\/\/CPL.*$/gm)[0].substr(6)));
            if (this.hasUpdate(this.getPluginVersion(), pluginInfo.version)) {
                BdApi.showConfirmationModal("Plugin update", `A new version of ${this.getPluginName()} is available! Update now?`, {
                    confirmText: "Update",
                    cancelText: "Maybe later",
                    onConfirm: () => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=__PLUGIN_RAW__");
                        new Promise((r) => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, `__PLUGIN_NAME__.plugin.js`), body, r)).then(() => {
                            BdApi.showToast("__PLUGIN_NAME__ has been updated", () => {});
                        });
                    },
                });
            }
        });
    }
    hasUpdate(a, b) {
        let x = a.split(".").map((e) => parseInt(e));
        let y = b.split(".").map((e) => parseInt(e));
        let z = "";

        for (let i = 0; i < x.length; i++) {
            if (x[i] === y[i]) {
                z += "e";
            } else if (x[i] > y[i]) {
                z += "m";
            } else {
                z += "l";
            }
        }
        if (!z.match(/[l|m]/g)) {
            return false;
        } else if (z.split("e").join("")[0] == "m") {
            return false;
        } else {
            return true;
        }
    }
    /**
     *
     * @param {MouseEvent} e
     */
    onClickEvent(e) {
        if (e.target.nodeName == "A" && e.target.className.includes("anchor-")) {
            if (this.settings.incognitoEnable && ((this.settings.incognitoInvert && e.shiftKey) || (!this.settings.incognitoInvert && !e.shiftKey)) && !e.ctrlKey) {
                if (this.settings.incognitoChrome) {
                    require("child_process").exec(`start chrome -incognito ${e.target.href}`);
                    e.preventDefault();
                } else if (this.settings.incognitoEdge) {
                    require("child_process").exec(`start msedge -inprivate ${e.target.href}`);
                    e.preventDefault();
                } else if (this.settings.incognitoFirefox) {
                    require("child_process").exec(`start firefox -private ${e.target.href}`);
                    e.preventDefault();
                }
            } else if (this.settings.openInDiscordEnable && e.ctrlKey) {
                e.preventDefault();
                let electron = require("electron");
                let win = new electron.remote.BrowserWindow({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundColor: "#26262b",
                    webPreferences: {
                        nodeIntegration: false,
                    },
                });
                win.menuBarVisible = false;
                if (this.settings.openInDiscordMaximize) {
                    win.maximize();
                }
                win.loadURL(e.target.href);
            }
        }
    }
};

const {app} = require('electron')
const {join} = require('path')

exports.InitializeBase = function () {
    console.log('[InitializeBase] Started.')
    // Set proper cache folder
    app.setPath("userData", join(app.getPath("cache"), app.name))

    // Detects if the application has been opened with --force-quit
    if (app.commandLine.hasSwitch('force-quit')) {
        console.log("[Apple-Music-Electron] User has closed the application via --force-quit")
        app.quit()
    }

    // Disable CORS
    if (app.config.quick.authMode.indexOf(true)) app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

    // Media Key Hijacking
    if (app.config.advanced.preventMediaKeyHijacking.indexOf(true)) app.commandLine.appendSwitch('disable-features', 'HardwareMediaKeyHandling');

    // Just turn it on because i was dumb and made it so you have to have both on.
    if (app.config.css.emulateMacOS.indexOf("rightAlign") && !app.config.css.emulateMacOS.indexOf(true)) app.config.css.emulateMacOS = true;


    // Sets the ModelId (For windows notifications)
    if (process.platform === "win32") app.setAppUserModelId("Apple Music");

    // Assign Default Variables
    app.isQuiting = !app.config.preferences.closeButtonMinimize.indexOf(true);
    app.config.css.glasstron = app.config.preferences.cssTheme.toLowerCase().split('-').includes('glasstron');
    app.win = '';
    app.ipc = {
        ThumbarUpdate: true,
        TooltipUpdate: true,
        DiscordUpdate: true,
        MprisUpdate: true,
        MprisStatusUpdate: true,
        MediaNotification: true,
        cache: false,
        cacheNew: false,
        existingNotification: false
    };
    app.discord = {client: false, error: false, cachedAttributes: false};
    app.mpris = {}

    // Init
    const {InitializeAutoUpdater} = require('./Init-AutoUpdater')
    InitializeAutoUpdater()
}
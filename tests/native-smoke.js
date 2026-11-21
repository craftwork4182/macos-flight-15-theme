// Appended to Flight15.js on the disposable macOS runner. This run handler
// exercises the same native functions as the picker without a modal dialog.
function run(argv) {
    $.NSApplication.sharedApplication;
    const resources = $.NSURL.fileURLWithPath(argv[0]).URLByAppendingPathComponent('Contents/Resources/Flight15');
    const names = sceneNames(resources);
    if (names.length !== 12) throw Error('Expected twelve packaged scenes');
    const files = $.NSFileManager.defaultManager;
    for (const name of names) {
        const still = resources.URLByAppendingPathComponent('Wallpapers/' + name + '.png');
        const clip = resources.URLByAppendingPathComponent('Intros/' + name + '.mp4');
        if (!$.NSImage.alloc.initWithContentsOfURL(still).isValid || !files.fileExistsAtPath(clip.path)) {
            throw Error('Missing or unreadable scene ' + name);
        }
    }
    const profile = resources.URLByAppendingPathComponent('Profiles/Flight 15.terminal');
    const colors = $.NSDictionary.dictionaryWithContentsOfURL(profile);
    const color = $.NSKeyedUnarchiver.unarchiveObjectWithData(colors.objectForKey('ANSIGreenColor'));
    if (!color.isKindOfClass($.NSColor.class)) throw Error('Terminal profile color failed to decode');

    const screen = $.NSScreen.mainScreen;
    if (screen.isNil()) return 'Bundle and profiles passed; no display attached for the playback check.';
    const clip = resources.URLByAppendingPathComponent('Intros/' + names[0] + '.mp4');
    const overlay = introWindow(clip, screen);
    let sawFrame = false;
    let finished = false;
    try {
        overlay.window.orderFrontRegardless;
        overlay.player.play;
        const deadline = Date.now() + 15000;
        while (Date.now() < deadline && !finished) {
            pumpEvents(0.05);
            sawFrame = sawFrame || overlay.layer.isReadyForDisplay;
            finished = playbackFinished(overlay);
        }
    } finally {
        overlay.player.pause;
        overlay.window.orderOut(null);
        overlay.window.close;
    }
    if (!sawFrame || !overlay.started || !finished || playbackFailed(overlay.player)) {
        throw Error('The first intro did not play to its end: ' + JSON.stringify({
            sawFrame, started: overlay.started, finished, playerStatus: overlay.player.status,
            itemStatus: overlay.player.currentItem.status, timeControlStatus: overlay.player.timeControlStatus
        }));
    }

    const workspace = $.NSWorkspace.sharedWorkspace;
    const previous = workspace.desktopImageURLForScreen(screen);
    const options = workspace.desktopImageOptionsForScreen(screen);
    if (previous.isNil()) return 'Bundle, profiles and playback passed; no previous desktop image to restore.';
    try {
        applyWallpaper(resources.URLByAppendingPathComponent('Wallpapers/' + names[0] + '.png'), [screen]);
    } finally {
        const error = Ref();
        if (!workspace.setDesktopImageURLForScreenOptionsError(previous, screen, options, error)) {
            throw Error(ObjC.unwrap(error[0].localizedDescription));
        }
    }
    return 'Bundle, profiles, playback and wallpaper checks passed.';
}

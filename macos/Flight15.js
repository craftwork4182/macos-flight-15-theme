// JavaScript for Automation, compiled into a macOS applet by osacompile.
ObjC.import('AppKit');

function sceneNames(resources) {
    const folder = resources.URLByAppendingPathComponent('Wallpapers');
    const error = Ref();
    const files = $.NSFileManager.defaultManager.contentsOfDirectoryAtPathError(folder.path, error);
    if (files.isNil()) throw Error(ObjC.unwrap(error[0].localizedDescription));
    return ObjC.deepUnwrap(files)
        .filter(name => /^\d{2}-.+\.png$/.test(name))
        .map(name => name.slice(0, -4))
        .sort();
}

function sceneTitle(name) {
    const words = name.slice(3).replace(/-/g, ' ');
    return name.slice(0, 2) + '   ' + words.charAt(0).toUpperCase() + words.slice(1);
}

function chooseScene(names, resources, defaults, reduceMotion) {
    const last = ObjC.unwrap(defaults.stringForKey('LastScene'));
    const menu = $.NSPopUpButton.alloc.initWithFramePullsDown($.NSMakeRect(0, 36, 302, 28), false);
    menu.addItemsWithTitles($(names.map(sceneTitle)));
    menu.selectItemAtIndex((names.indexOf(last) + 1) % names.length);

    const motion = $.NSButton.alloc.initWithFrame($.NSMakeRect(0, 0, 302, 28));
    motion.setButtonType($.NSSwitchButton);
    motion.title = reduceMotion ? 'Intro disabled by Reduce Motion' : 'Play the matching intro';
    motion.enabled = !reduceMotion;
    motion.state = !reduceMotion && defaults.boolForKey('PlayIntro') ? 1 : 0;

    const controls = $.NSView.alloc.initWithFrame($.NSMakeRect(0, 0, 306, 66));
    controls.addSubview(menu);
    controls.addSubview(motion);
    const alert = $.NSAlert.alloc.init;
    alert.messageText = 'Flight 15';
    alert.informativeText = 'Choose a wallpaper for your connected displays.';
    alert.accessoryView = controls;
    alert.addButtonWithTitle('Set Wallpaper');
    alert.addButtonWithTitle('Cancel');
    alert.addButtonWithTitle('Show Theme Files');
    const response = alert.runModal;
    if (response === $.NSAlertThirdButtonReturn) $.NSWorkspace.sharedWorkspace.openURL(resources);
    if (response !== $.NSAlertFirstButtonReturn) return null;
    if (!reduceMotion) defaults.setBoolForKey(motion.state === 1, 'PlayIntro');
    return {name: names[menu.indexOfSelectedItem], animate: motion.state === 1};
}

function applyWallpaper(url, screens) {
    const options = $.NSMutableDictionary.alloc.init;
    options.setObjectForKey($.NSNumber.numberWithInteger($.NSImageScaleProportionallyUpOrDown),
        $.NSWorkspaceDesktopImageScalingKey);
    options.setObjectForKey($.NSNumber.numberWithBool(true), $.NSWorkspaceDesktopImageAllowClippingKey);
    const failures = [];
    for (const screen of screens) {
        const error = Ref();
        if (!$.NSWorkspace.sharedWorkspace.setDesktopImageURLForScreenOptionsError(url, screen, options, error)) {
            failures.push(ObjC.unwrap(screen.localizedName) + ': ' + ObjC.unwrap(error[0].localizedDescription));
        }
    }
    if (failures.length) throw Error(failures.join('\n'));
}

// Each display needs its own player: a player shared by several layers may
// render on only one of them. Keep the windows below Finder's desktop icons.
function introWindow(url, screen) {
    ObjC.import('AVFoundation');
    ObjC.import('CoreGraphics');
    ObjC.import('QuartzCore');
    // AVFoundation reexports the player classes from a subframework. Some
    // versions of the JXA bridge omit them from $, even when they are loaded.
    const framework = $.NSBundle.bundleWithPath('/System/Library/Frameworks/AVFoundation.framework');
    if (!framework.load) throw Error('Could not load AVFoundation');
    const Player = $.NSClassFromString('AVPlayer');
    const PlayerLayer = $.NSClassFromString('AVPlayerLayer');
    if (Player.isNil() || PlayerLayer.isNil()) throw Error('AVFoundation player classes are unavailable');
    const player = Player.playerWithURL(url);
    player.muted = true;
    // A single-item AVPlayer pauses at the end by default.
    const layer = PlayerLayer.playerLayerWithPlayer(player);
    layer.videoGravity = $('resizeAspectFill');
    const window = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
        screen.frame, $.NSWindowStyleMaskBorderless, $.NSBackingStoreBuffered, false);
    window.releasedWhenClosed = false;
    window.opaque = false;
    window.backgroundColor = $.NSColor.clearColor;
    window.hasShadow = false;
    window.ignoresMouseEvents = true;
    window.level = $.CGWindowLevelForKey($.kCGDesktopIconWindowLevelKey) - 1;
    window.collectionBehavior = $.NSWindowCollectionBehaviorCanJoinAllSpaces |
        $.NSWindowCollectionBehaviorStationary | $.NSWindowCollectionBehaviorIgnoresCycle;
    window.setFrameDisplay(screen.frame, false);
    const view = window.contentView;
    view.wantsLayer = true;
    layer.frame = view.bounds;
    view.layer.addSublayer(layer);
    return {window, player, layer, started: false};
}

function pumpEvents(seconds) {
    $.NSRunLoop.currentRunLoop.runUntilDate($.NSDate.dateWithTimeIntervalSinceNow(seconds));
}

function playbackFailed(player) {
    // AVPlayerItemStatusFailed and AVPlayerStatusFailed both have raw value 2.
    return player.currentItem.status === 2 || player.status === 2;
}

function playbackFinished(overlay) {
    const player = overlay.player;
    if (playbackFailed(player)) return true;
    const state = player.timeControlStatus;
    // AVPlayerTimeControlStatus uses 2 for playing and 0 for paused.
    if (state === 2) overlay.started = true;
    return overlay.started && state === 0;
}

function presentScene(resources, scene, screens) {
    const still = resources.URLByAppendingPathComponent('Wallpapers/' + scene.name + '.png');
    const clip = resources.URLByAppendingPathComponent('Intros/' + scene.name + '.mp4');
    const overlays = [];
    let playing = false;
    try {
        if (scene.animate) {
            try {
                for (const screen of screens) overlays.push(introWindow(clip, screen));
                for (const overlay of overlays) {
                    overlay.window.orderFrontRegardless;
                    overlay.player.play;
                }
                const firstFrameDeadline = Date.now() + 2000;
                while (Date.now() < firstFrameDeadline &&
                       !overlays.every(o => o.layer.isReadyForDisplay || playbackFailed(o.player))) {
                    pumpEvents(0.05);
                }
                overlays.forEach(playbackFinished);
                playing = true;
            } catch (error) {
                console.log('Flight 15 intro: ' + error.message);
            }
        }
        // Let macOS load the still underneath the clip. When the final frame
        // goes away, the matching desktop image is already in place.
        applyWallpaper(still, screens);
        if (playing) {
            // All twelve clips are under eight seconds. Bound a stalled decoder.
            const deadline = Date.now() + 15000;
            while (Date.now() < deadline) {
                if (overlays.map(playbackFinished).every(Boolean)) break;
                pumpEvents(0.05);
            }
        }
    } finally {
        for (const overlay of overlays) {
            overlay.player.pause;
            overlay.window.orderOut(null);
            overlay.window.close;
        }
    }
}

function run() {
    $.NSApplication.sharedApplication.activateIgnoringOtherApps(true);
    try {
        const resources = $.NSBundle.mainBundle.resourceURL.URLByAppendingPathComponent('Flight15');
        const names = sceneNames(resources);
        if (!names.length) throw Error('No wallpapers found. Run the Flight 15 installer again.');
        const defaults = $.NSUserDefaults.standardUserDefaults;
        defaults.registerDefaults($({LastScene: '', PlayIntro: true}));
        const reduceMotion = $.NSWorkspace.sharedWorkspace.accessibilityDisplayShouldReduceMotion;
        const scene = chooseScene(names, resources, defaults, reduceMotion);
        if (!scene) return;
        const displays = $.NSScreen.screens;
        const screens = [];
        for (let i = 0; i < displays.count; i++) screens.push(displays.objectAtIndex(i));
        if (!screens.length) throw Error('Connect a display and open Flight 15 again.');
        presentScene(resources, scene, screens);
        defaults.setObjectForKey($(scene.name), 'LastScene');
    } catch (error) {
        const alert = $.NSAlert.alloc.init;
        alert.messageText = 'Flight 15 could not set the wallpaper';
        alert.informativeText = String(error.message || error);
        alert.runModal;
    }
}

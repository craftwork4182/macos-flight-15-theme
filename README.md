# Flight 15 for macOS

Watch Starship lift off, climb through the plume and return to the tower. Flight 15 brings all twelve scenes from [yamz8’s Omarchy theme](https://github.com/yamz8/omarchy-flight-15-theme) to the Mac. Each scene has a silent 4K intro that settles into its matching wallpaper. The included Terminal and iTerm2 profiles use the original Starship palette.

![Scene 06, Starship climbing through the plume in golden light](backgrounds/06-golden-hour-climb.webp)

## Install

1. On a Mac running **macOS 13 Ventura or later**, [download the theme ZIP](https://github.com/craftwork4182/macos-flight-15-theme/archive/refs/heads/main.zip). It includes all twelve scenes (about 324 MiB). In Finder, open **Downloads** and double-click the ZIP if your browser hasn’t already extracted it.
2. Open the extracted **macos-flight-15-theme-main** folder and double-click **Install Flight 15.command**. Alternatively, open Terminal, type `bash` followed by a space, drag the installer file into the Terminal window, and press **Return**. It builds **Flight 15.app** in your home **Applications** folder using tools included with macOS.
3. Choose a scene and click **Set Wallpaper**. Open **Flight 15** again from Spotlight or Finder to change it. The picker preselects the next scene in flight order and wraps from the tower catch back to ignition.

The clip plays behind your windows and desktop icons, then the app quits and macOS keeps the still. To see the whole scene, show your desktop. Uncheck **Play the matching intro** for an instant change. Flight 15 also follows **System Settings → Accessibility → Display → Reduce motion**.

If you have the compact installer ZIP, open the **Flight 15 for macOS** folder instead. Its installer downloads and verifies the original media.

The picker sets the wallpaper on the current desktop Space of each connected display. Open it in another Space to apply a scene there. For automatic rotation of the stills, click **Show Theme Files** and add its **Wallpapers** folder in **System Settings → Wallpaper**.

## Terminal and appearance

Click **Show Theme Files** in the picker, then open **Profiles**. The same two files are also in [macos/Profiles](macos/Profiles).

- **Terminal** — Open **Flight 15.terminal** to try the profile in a new window. To use it for new sessions, select **Flight 15** in **Terminal → Settings → Profiles** and click **Default**.
- **iTerm2** — In **Settings → Profiles → Colors → Color Presets**, choose **Import**, select **Flight 15.itermcolors**, then choose **Flight 15** from the presets.
- **macOS controls** — For matching window and menu colors, choose **Dark** appearance and the **Orange** accent in **System Settings → Appearance**.

<details>
<summary>Explore all twelve scenes</summary>

| # | Background | Shot |
| --- | --- | --- |
| 01 | `01-pad-ignition-ground` | Steam builds, the engines ignite, and the fire grows under the full stack on the pad |
| 02 | `02-pad-aerial-plume` | High aerial, the plume blows out across the pad |
| 03 | `03-liftoff-past-tower` | The rocket rises past the tower |
| 04 | `04-wide-reflection-water` | Wide across the water, tower and rocket reflected |
| 05 | `05-top-down-exhaust` | Straight down from the tower into the exhaust |
| 06 | `06-golden-hour-climb` | Golden hour, climbing out of the steam |
| 07 | `07-aerial-climb-blue-sky` | Aerial chase into blue sky |
| 08 | `08-onboard-ship-looking-down` | Onboard Ship 42, looking down at the pad |
| 09 | `09-onboard-flip-over-starbase` | The next day: riding on Ship 42 down through the clouds and into the flip over Starbase |
| 10 | `10-landing-burn-beside-tower` | Ship 42 comes home on its engines and stops beside the tower |
| 11 | `11-into-the-chopsticks` | From the tower: Ship 42 comes down into the chopsticks on its engines |
| 12 | `12-caught-at-the-tower` | Ship 42 held by the tower's chopsticks (slowed 1.5x) |

</details>

## Restore the macOS desktop

1. Open **Apple menu  → System Settings → Wallpaper**. Choose the built-in Apple wallpaper for your macOS version, or reselect your previous picture. For the day and night versions of a dynamic wallpaper, choose **Dynamic** if offered. Use **Show on all Spaces** if available, or repeat on each desktop or display where you applied Flight 15.
2. If you manually changed the system colors, go to **System Settings → Appearance**. Choose your previous appearance, or **Auto** for automatic light and dark mode. Under **Color** (called **Accent color** on earlier versions), choose the multicolored option or your previous color.
3. If you made Flight 15 your Terminal default, open **Terminal → Settings → Profiles**, select **Basic** or your previous profile, click **Default**, and open a new window. In iTerm2, choose your previous preset under **Settings → Profiles → Colors → Color Presets** if you changed it.

Choosing another wallpaper is enough if you only used the scene picker. To uninstall afterward, open Finder, press **Shift–Command–G**, enter `~/Applications`, and move **Flight 15.app** to the Trash. To update the theme, run the installer from a newer download.

## Credits

The scene selection, video edits and matching stills are by **yamz8**. The underlying SpaceX footage remains subject to SpaceX’s rights. See [NOTICE.md](NOTICE.md) for sources and editing details. The Starship palette comes from [Omarchy](https://github.com/omacom/omarchy) under its MIT license. The macOS scripts and profile generation code use the repository’s [MIT license](LICENSE).

"""Regenerate the two importable macOS terminal profiles from colors.toml."""

from pathlib import Path
import plistlib
import tomllib


ROOT = Path(__file__).resolve().parent
with (ROOT.parent / "colors.toml").open("rb") as file:
    palette = tomllib.load(file)

# Slot order follows Omarchy's terminal templates, including the amber ANSI green.
slots = (
    "background", "red", "green", "yellow", "blue", "magenta", "cyan", "foreground",
    "muted", "bright_red", "bright_green", "bright_yellow", "bright_blue",
    "bright_magenta", "bright_cyan", "bright_foreground",
)
ansi_names = ("Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White")


def components(key):
    value = palette[key].removeprefix("#")
    return tuple(int(value[pos:pos + 2], 16) / 255 for pos in (0, 2, 4))


def terminal_color(key):
    # Terminal stores each color as a binary NSKeyedArchiver archive of an NSColor.
    rgb = " ".join(f"{value:.9f}" for value in components(key))
    uid = plistlib.UID
    return plistlib.dumps({
        "$archiver": "NSKeyedArchiver",
        "$version": 100000,
        "$top": {"root": uid(1)},
        "$objects": [
            "$null",
            {"NSRGB": rgb.encode("ascii") + b"\0", "NSColorSpace": 2, "$class": uid(2)},
            {"$classname": "NSColor", "$classes": ["NSColor", "NSObject"]},
        ],
    }, fmt=plistlib.FMT_BINARY)


def iterm_color(key):
    red, green, blue = components(key)
    return {"Color Space": "sRGB", "Red Component": red, "Green Component": green,
            "Blue Component": blue, "Alpha Component": 1.0}


terminal = {"name": "Flight 15", "type": "Window Settings", "ProfileCurrentVersion": 2.04}
iterm = {}
for i, key in enumerate(slots):
    name = ("Bright" if i >= 8 else "") + ansi_names[i % 8]
    terminal[f"ANSI{name}Color"] = terminal_color(key)
    iterm[f"Ansi {i} Color"] = iterm_color(key)

for terminal_key, iterm_key, key in (
    ("BackgroundColor", "Background Color", "background"),
    ("TextColor", "Foreground Color", "foreground"),
    ("TextBoldColor", "Bold Color", "bright_foreground"),
    ("CursorColor", "Cursor Color", "bright_foreground"),
    ("SelectionColor", "Selection Color", "selection"),
):
    terminal[terminal_key] = terminal_color(key)
    iterm[iterm_key] = iterm_color(key)
iterm["Cursor Text Color"] = iterm_color("background")
iterm["Selected Text Color"] = iterm_color("foreground")

profiles = ROOT / "Profiles"
profiles.mkdir(exist_ok=True)
for name, profile in (("Flight 15.terminal", terminal), ("Flight 15.itermcolors", iterm)):
    (profiles / name).write_bytes(plistlib.dumps(profile))

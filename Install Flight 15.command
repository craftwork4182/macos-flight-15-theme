#!/bin/bash
set -euo pipefail

# Finder runs this with no arguments. --build creates a copy without opening it.
launch=yes
if [[ $# == 2 && $1 == --build ]]; then
  apps=$2
  launch=no
elif [[ $# == 0 ]]; then
  apps="$HOME/Applications"
else
  echo "Usage: $0 [--build output-directory]" >&2
  exit 2
fi
if [[ $(uname -s) != Darwin ]]; then
  echo 'Flight 15 requires macOS 13 or later.' >&2
  exit 1
fi
version=$(/usr/bin/sw_vers -productVersion)
if (( ${version%%.*} < 13 )); then
  echo 'Flight 15 requires macOS 13 or later.' >&2
  exit 1
fi

root=$(cd -- "$(dirname -- "$0")" && pwd -P)
bundle_id=io.github.craftwork4182.flight15
plistbuddy=/usr/libexec/PlistBuddy
mkdir -p "$apps"
apps=$(cd -- "$apps" && pwd -P)
target="$apps/Flight 15.app"
stage=$(mktemp -d "$apps/.flight15.XXXXXXXX")
new="$stage/Flight 15.app"
cleanup() {
  # Recover the previous install if the final rename was interrupted.
  if [[ -d "$stage/previous.app" && ! -e "$target" ]]; then
    mv "$stage/previous.app" "$target" || return 1
  fi
  rm -rf "$stage"
}
trap cleanup EXIT
trap 'exit 1' HUP INT TERM

media="$root/backgrounds"
if [[ ! -d "$media" ]]; then
  # The compact download contains the port and the original media checksums.
  revision=9cccd38dee16b051071f3b5b786abcf692034e1a
  source_url="https://raw.githubusercontent.com/yamz8/omarchy-flight-15-theme/$revision/backgrounds"
  media="$stage/media"
  mkdir -p "$media/intros"
  echo 'Downloading the twelve original scenes (about 325 MiB)…'
  while read -r _checksum file; do
    echo "Fetching $file"
    /usr/bin/curl --fail --silent --show-error --location --retry 2 --connect-timeout 20 \
      "$source_url/$file" --output "$media/$file"
  done < "$root/macos/media.sha256"
  (cd "$media" && /usr/bin/shasum -a 256 -c "$root/macos/media.sha256")
fi

shopt -s nullglob
stills=("$media"/[0-9][0-9]-*.webp)
if (( ${#stills[@]} == 0 )); then
  echo 'No wallpaper stills found. Extract the complete theme before installing.' >&2
  exit 1
fi
for still in "${stills[@]}"; do
  file=${still##*/}
  clip="$media/intros/${file%.webp}.mp4"
  if [[ ! -s "$clip" ]]; then
    echo "Missing intro: $clip" >&2
    exit 1
  fi
done

/usr/bin/osacompile -l JavaScript -o "$new" "$root/macos/Flight15.js"
plist="$new/Contents/Info.plist"
# osacompile supplies the bundle identifier; keep it stable across updates.
"$plistbuddy" -c "Set :CFBundleIdentifier $bundle_id" "$plist" || \
  "$plistbuddy" -c "Add :CFBundleIdentifier string $bundle_id" "$plist"
"$plistbuddy" -c 'Set :LSMinimumSystemVersion 13.0' "$plist" 2>/dev/null || \
  "$plistbuddy" -c 'Add :LSMinimumSystemVersion string 13.0' "$plist"

resources="$new/Contents/Resources/Flight15"
mkdir -p "$resources/Wallpapers" "$resources/Intros"
cp -R "$root/macos/Profiles" "$resources/Profiles"
cp "$root/LICENSE" "$root/NOTICE.md" "$resources/"
for still in "${stills[@]}"; do
  file=${still##*/}
  scene=${file%.webp}
  echo "Preparing $scene"
  /usr/bin/sips -s format png "$still" --out "$resources/Wallpapers/$scene.png" >/dev/null
  cp "$media/intros/$scene.mp4" "$resources/Intros/$scene.mp4"
done
/usr/bin/codesign --force --sign - "$new"
/usr/bin/codesign --verify --strict "$new"

# Serialize only the swap. Two simultaneous launches may prepare independently.
lock="$apps/.flight15-install-lock"
if ! mkdir "$lock" 2>/dev/null; then
  echo "Another installation is finishing. If it was interrupted, remove $lock and retry." >&2
  exit 1
fi
trap 'cleanup; rmdir "$lock"' EXIT
if [[ -e "$target" || -L "$target" ]]; then
  existing_id=$("$plistbuddy" -c 'Print :CFBundleIdentifier' "$target/Contents/Info.plist" 2>/dev/null || true)
  if [[ -L "$target" || "$existing_id" != "$bundle_id" ]]; then
    echo "A different item already exists at $target. Choose another folder with --build." >&2
    exit 1
  fi
  mv "$target" "$stage/previous.app"
fi
mv "$new" "$target"
echo "Created $target"
if [[ $launch == yes ]]; then
  /usr/bin/open "$target"
fi

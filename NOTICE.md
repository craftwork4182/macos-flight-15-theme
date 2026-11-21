# Footage notice

The backgrounds and intro videos in `backgrounds/` are cut from SpaceX's own videos of Starship Flight 15 (launch on November 13, 2026 and the ship catch on November 14, 2026), as posted by SpaceX on X. The footage keeps SpaceX's rights. It is not covered by this repository's licence, and this theme is not made, endorsed or sponsored by SpaceX.

Edits made to the footage: cutting at shot boundaries, dropping the sound, changing speed (slowing some shots with frame interpolation, and speed ramps that run faster early and slow into the final frame, blending neighbouring frames where a ramp falls between them), cropping some shots to leave out the webcast telemetry bar along the bottom or the webcast clock in the top-left corner, painting the webcast clock out of the top-left corner on other shots, and AI upscaling of five background stills from their video frame (Higgsfield's image upscaler), with the intro blending into the upscaled still in its last half second. Each upscale was checked against its original frame; where the upscaler changed any detail of the vehicle, the original frame is used instead. Each background is the last frame of its intro.

`colors.toml` is the palette of Omarchy's built-in Starship theme (MIT licence, https://github.com/basecamp/omarchy), reused unchanged so this theme feels the same.

The macOS installer converts these stills to PNG and copies the original intro clips. The same footage notice applies to the installed media.

## Omarchy palette and terminal profiles

The macOS terminal profiles derive from Omarchy's Starship palette. Its [license](https://github.com/omacom/omarchy/blob/quattro/LICENSE) reads as follows.

Copyright (c) David Heinemeier Hansson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

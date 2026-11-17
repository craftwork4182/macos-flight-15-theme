# Footage notice

The backgrounds and intro videos in `backgrounds/` are cut from SpaceX's own videos of Starship Flight 15 (launch on November 13, 2026 and the ship catch on November 14, 2026), as posted by SpaceX on X. The footage keeps SpaceX's rights. It is not covered by this repository's licence, and this theme is not made, endorsed or sponsored by SpaceX.

Edits made to the footage: cutting at shot boundaries, dropping the sound, changing speed (slowing some shots with frame interpolation, and speed ramps that run faster early and slow into the final frame, blending neighbouring frames where a ramp falls between them), cropping some shots to leave out the webcast telemetry bar along the bottom or the webcast clock in the top-left corner, painting the webcast clock out of the top-left corner on other shots, and AI upscaling of five background stills from their video frame (Higgsfield's image upscaler), with the intro blending into the upscaled still in its last half second. Each upscale was checked against its original frame; where the upscaler changed any detail of the vehicle, the original frame is used instead. Each background is the last frame of its intro.

`colors.toml` is the palette of Omarchy's built-in Starship theme (MIT licence, https://github.com/basecamp/omarchy), reused unchanged so this theme feels the same.

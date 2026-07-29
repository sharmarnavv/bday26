Forget every visual, animation, component and styling decision you have made so far.

Keep ONLY the existing countdown functionality exactly as it is. Do not modify its logic.

Everything else should be rebuilt from scratch.

## Vision

The website should feel like the opening screen of an 8-bit indie game.

Simple.
Peaceful.
Nostalgic.
Cozy.

The background should ONLY be a pixel-art night sky.

No landscape.
No mountains.
No trees.
No buildings.
No moon.
No foreground objects.

The sky itself should be the entire experience.

## Art Style

Use authentic 8-bit pixel art.

Everything should snap to the pixel grid.

No anti-aliasing.

No smooth gradients.

Use classic pixel dithering where appropriate.

The style should feel inspired by classic SNES-era games, but with a restrained modern color palette.

## Sky

Fill the screen with a deep navy night sky.

Scatter hundreds of pixel stars across the canvas.

Stars should have varying brightness and sizes:

- tiny pixels
- small crosses
- slightly brighter stars

The distribution should feel natural rather than evenly spaced.

## Animation

The animation should be extremely subtle.

Stars should twinkle independently.

Each star should slowly brighten and dim using randomized timings.

No synchronized blinking.

Occasionally (roughly every 20–40 seconds), a single shooting star should cross the sky.

The shooting star should be quick, subtle, and never distracting.

## Countdown

Keep the current countdown logic.

Only redesign its appearance.

Use a pixel-art font such as:

- Press Start 2P
- Pixel Operator
- VT323

The countdown should sit centered on the page.

Its color should be a warm off-white (#F5ECD8).

No glow.

No glassmorphism.

No cards.

No shadows.

It should simply exist within the night sky.

## Colors

Background:
#0B1736

Secondary sky tones:
#13254D

Stars:
#F5ECD8

Bright stars:
#FFF8DC

Accent:
#E8C46A (use sparingly)

Keep the palette limited and cohesive.

## Layout

The countdown remains the primary focal point.

The stars provide atmosphere without competing for attention.

Leave generous negative space around the countdown.

## Performance

Do not use videos.

Do not use GIFs.

Render everything procedurally using HTML5 Canvas or PixiJS.

The animation should maintain 60 FPS on modern hardware.

## Code

Separate the scene into reusable components:

- NightSky
- StarField
- ShootingStar
- Countdown

Keep animation logic independent from countdown logic.

The final result should feel like quietly staring at a beautiful 8-bit night sky while waiting for midnight.
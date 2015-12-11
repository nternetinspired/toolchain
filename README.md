# My Default Toolchain
The start-point for most of my projects, saved here so I don't have to keep digging around in active projects trying to find my latest version ;)

## What does it do?
One of the primary goals in my project setups is to draw a very clear line between source files and production files; the two are very separate beasts. This file enforces that in a pretty heavy-handed way by deleting the contents of the output folders on each run. Don't put things in the /assets/ directory directly, because you'll quickly lose them.

### That's a little vague…
Yes, but I think it's important to look at the overall thoughts behind project structures, as well as the details. Here's what happens, in order, when you run the commands:

`grunt`

1. The (configurable) output destination, /assets/ by default is emptied.
2. Images are optimised (non-destructively).
3. SVGs in the source icon folder are run through Grunticon. It's like magic.
3. scss-lint runs though your source files and lets you know if you did anything silly.
3. Sass is compiled, expanded, comments intact and with a sourcemap.
4. PostCSS runs Autoprefixer to any required vendor prefix junk to the resulting CSS file.
5. PostCSS runs CSSNano and optimises the bejesus out of the css output creating a *new* teeny-tiny version.
6. Any JS files in the src/plugin directory are combined to a single file, plugins.js.
7. Any JS files in src/js/vendor are copied across as-is.
9. Jekyll's build option is run (comment the task out if you ain't building with Jekyll!)
10. BrowserSync serves your site up to your localhost and provides a LAN IP for it as well.
11. The watch task fires up and watches certain files and folders for changes. Changes to src/js files src/sass files or any Jekyll source file will trigger the appropriate build task tgo run again.

`grunt build`

1. Tasks 1–6, as above.
6. Minify the heck out of our JS plugins *and* concatenate them to a single file.
7. Minifiy the heck out of /src/js/scripts.js
8. Any JS files in src/js/vendor are copied across as-is.
9. Exit and tell you how fast each task was executed:
![Grunt build result](https://dl.dropboxusercontent.com/u/10118147/grunt-build-result.png)

`grunt test`

1. Check your source Scss for consistency and silly mistakes, then tells you all about it.

## Installation
Drop these files into your project folder and run `npm update`. If you get a load of permission errors use `sudo npm update`.

## Applicability
There's a pretty big assumptions in this file, that you are using Sass, but then why wouldn't you be? If you aren't this probably isn't a good start-point for you.

## Issues and Contributions
Did you find something I did wrong? Please [open an issue](https://github.com/nternetinspired/toolchain/issues) and let me know!

You're just a really nice person and want to make this file more awesome? [pull requests are always welcome](https://github.com/nternetinspired/toolchain/issues) :) Thanks.

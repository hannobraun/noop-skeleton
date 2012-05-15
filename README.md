# noop skeleton project

## What is it?

It's a minimal example project using the
[noop game framework](https://github.com/hbraun/noop). If you want to get
started with the framework, just clone this repository and start adding your own
code.

Like noop itself, this skeleton project is written in CoffeeScript. If you want
to use JavaScript instead, it shouldn't be too hard to adapt the project.


## How do I get started?

1. Clone this repository.
2. Install [Node.js](http://nodejs.org)
3. Install [CoffeeScript](http://coffeescript.org) using npm.
4. Execute ./develop
5. Open public/index.html and test/index.html in a browser.
6. Write code!


## Where can I learn more about noop?

Right now there's barely any documentation. Until any shows up at the
[noop repository](https://github.com/hbraun/noop) the code itself is your best
source of information.


## Please explain the directory structure.

This project features a directory structure that has proven beneficial for noop
projects. Please understand that noop doesn't enforce this directory structure
in any way, so you're free to change it as you like.

<pre>
+ root - Miscellaneous files that don't belong anywhere else.
|
+-+ source - Source files created and modified by developers, be it code or art.
|            It is generally assumed that you (the developer) are the only one
|            modifying the contents of this directory.
|            There are sub-directories for code and graphics respectively.
+-+ test - Your unit tests. Again, there are sub-directories for code and
|          images.
+-+ vendor - Third-party library code, usually in the form of Git submodules.
|
+-+ output - Generated files, e.g. JavaScript output from the CoffeeScript
|            compiler. I recommend you don't check this into version control.
+-+ public - All the files needed for your game. These will be either present
             directly (HTML, CSS, ...) or via symbolic links to the source,
             output or vendor directories.
             The setup with the symbolic links may seem cumbersome at first, but
             it has the advantage that you can deploy your site by simply doing
             a "cp -r --dereference public path/to/deployment". This assumes
             that you're using Linux or something similar (sorry Windows users,
             you have to figure something out).
</pre>

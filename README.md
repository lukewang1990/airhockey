# Air Hockey - CSCI4140 course project

---

**Air Hockey** is a web-based game powered by Box2D, node.js and socket.io.

---

## Deployment

> * Play it within LAN (or anywhere that the round-trip time between the client and the server is not significant) for best game experience.
> * Use **npm install** to get dependencies installed properly
> * Have Apache2 and MySQL properly installed. *Symbolic link* / *Copy* the repository to **htdoc/** or **/var/www/** (the location as configured by httpd.conf)
> * Modify *php_module/db_module.php* so that correct db_user and db_password are available
> * Run *game_server.js* and *serverMatching.js* under *app/server/* by **node game_server.js** and **node serverMatching.js**
> * Search for **io.connect(** in *matching.js*, *game-ui.js* and *game-client.js* and update the domain names to be the **server IP** (where *game_server.js* and *serverMatching.js* are run on)
> * Use **app/admin/reinit.php** to reinitialize the system (database etc.)

## Usage

> * Register with required information / Login if already registered
> * Choose game type and number of players in the left-bottom part of game lobby
> * The right-hand side would list the available game rooms if they are there
> * Click **auto join** to join a game
> * Click **new game** to create a new game room with the toggled game type
> * Click **Ready** when inside the game room
> * When everyone in the game room have clicked *Ready*, the game starts
> * The game ends once either side scores five pts!
> * Exit to lobby once the game ends

## Libraries & Frameworks used

> * jquery/jquery
> * twbs/bootstrap
> * kripken/box2d.js
> * silviomoreto/bootstrap-select
> * carhartl/jquery-cookie
> * angular/angular-seed

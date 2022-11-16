function stickyCollision2() {
  //set up canvas
  var canvasID = "canvas2";
  var canvas = document.getElementById(canvasID);
  var ctx = canvas.getContext("2d");

  // module aliases
  var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();
  var scale = 1;
  //adjust gravity to fit simulation
  engine.world.gravity.scale = 0.000001 * scale;
  engine.world.gravity.y = 0;

  var mass = [];

  document.getElementById(canvasID).addEventListener("mousedown", function() {
    World.clear(engine.world, true); //clear matter engine, leave static
    mass = []; //clear mass array
    spawnList();
    clearTimeout(explodeTimer);
    explodeTimer = setTimeout(explode, 2000);
  });
  spawnList();
  function spawnList() {
    var Ypos = canvas.height * 0.5;
    var v = Math.ceil((Math.random() - 0.5) * 3 * 60);
    var len1 = 38 + Math.ceil(Math.random() * 60);
    var len2 = 38 + Math.ceil(Math.random() * 60);
    spawnMass(350 - len1 / 1.4 - v * 3, Ypos, v, 0, len1, 4, 0.1);
    spawnMass(350 + len2 / 1.4 - v * 3, Ypos, v, 0, len2, 4, 1.5);
    //write a problem based on the values in the spawn
    document.getElementById("ex2").innerHTML =
      "<strong>Click to Randomize Problem:</strong> Two masses are stuck until an explosion causes them to separate. After the explosion the " +
      mass[0].mass.toFixed(2) +
      " kg <span style='color: " +
      mass[0].color +
      "'>square</span> has a velocity of ???" +
      " m/s, and the " +
      mass[1].mass.toFixed(2) +
      " kg <span style='color: " +
      mass[1].color +
      "'>square</span> has a velocity of  ???" +
      " m/s. What was the velocity of the two squares before the explosion?" +
      "<details> <summary>solution</summary></details>";
    //re-encodes the mathjax into math, makes the $$ $$ work
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
  function spawnMass(xIn, yIn, VxIn, VyIn, length, sides, angle) {
    //spawn mass
    var i = mass.length;
    mass.push();
    mass[i] = Bodies.polygon(xIn * scale, yIn * scale, sides, length * scale, {
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 0,
      length: length,
      color: randomColor({
        luminosity: "bright"
      })
    });

    Body.setVelocity(mass[i], {
      x: (VxIn / 60) * scale,
      y: (-VyIn / 60) * scale
    });
    //Matter.Body.setAngle(mass[i], angle)
    //Matter.Body.setAngularVelocity(mass[i], -0.004   );
    World.add(engine.world, mass[i]);
  }

  var explodeTimer = setTimeout(explode, 2000);
  function explode() {
    mass[0].force = { x: -0.03, y: 0 };
    mass[1].force = { x: 0.03, y: 0 };
    setTimeout(function() {
      document.getElementById("ex2").innerHTML =
        "<strong>Click to Randomize Problem:</strong> Two masses are stuck until an explosion causes them to separate. After the explosion the " +
        mass[0].mass.toFixed(2) +
        " kg <span style='color: " +
        mass[0].color +
        "'>square</span> has a velocity of " +
        mass[0].velocity.x.toFixed(2) +
        " m/s, and the " +
        mass[1].mass.toFixed(2) +
        " kg <span style='color: " +
        mass[1].color +
        "'>square</span> has a velocity of  " +
        mass[1].velocity.x.toFixed(2) +
        " m/s. What was the velocity of the two squares before the explosion? <details> <summary>solution</summary>$$(m_{1}+m_{2})u=m_{1}v_{1}+m_{2}v_{2}$$" +
        "$$(" +
        mass[0].mass.toFixed(2) +
        " + " +
        mass[1].mass.toFixed(2) +
        ")u=(" +
        mass[0].mass.toFixed(2) +
        ")(" +
        mass[0].velocity.x.toFixed(2) +
        ") + (" +
        mass[1].mass.toFixed(2) +
        ")(" +
        mass[1].velocity.x.toFixed(2) +
        ")$$" +
        "$$(" +
        (mass[0].mass + mass[1].mass).toFixed(2) +
        ")u=" +
        (mass[0].mass * mass[0].velocity.x + mass[1].mass * mass[1].velocity.x).toFixed(2) +
        "$$" +
        "$$u=" +
        ((mass[0].mass * mass[0].velocity.x + mass[1].mass * mass[1].velocity.x) / (mass[0].mass + mass[1].mass)).toFixed(2) +
        " \\mathrm{\\tfrac{m}{s}}$$</details>";
      //re-encodes the mathjax into math, makes the $$ $$ work
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 100);
  }

  //add walls flush with the edges of the canvas
  // var offset = 25;
  // World.add(engine.world, [
  //   Bodies.rectangle(canvas.width*0.5, -offset-1, canvas.width * 2 + 2 * offset, 50, { //top
  //     isStatic: true,
  //     friction: 1,
  //     frictionStatic: 1,
  //   }),
  //   Bodies.rectangle(canvas.width * 0.5, canvas.height + offset + 1, canvas.width * 2 + 2 * offset, 50, { //bottom
  //     isStatic: true,
  //     friction: 1,
  //     frictionStatic: 1,
  //   }),
  //   Bodies.rectangle(canvas.width + offset + 1, canvas.height * 0.5, 50, canvas.height * 2 + 2 * offset, { //right
  //     isStatic: true,
  //     friction: 1,
  //     frictionStatic: 1,
  //   }),
  //   Bodies.rectangle(-offset-1, canvas.height*0.5, 50, canvas.height * 2 + 2 * offset, {  //left
  //     isStatic: true,
  //     friction: 1,
  //     frictionStatic: 1,
  //   })
  // ]);

  // run the engine
  Engine.run(engine);

  //render
  (function render() {
    var bodies = Composite.allBodies(engine.world);
    window.requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(255,255,255,0.4)';  //trails
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    for (var i = 0; i < bodies.length; i += 1) {
      var vertices = bodies[i].vertices;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (var j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
      if (bodies[i].color) {
        ctx.fillStyle = bodies[i].color;
      } else {
        ctx.fillStyle = "#ccc";
      }
      ctx.fill();
      ctx.stroke();
    }

    //draw lines
    // ctx.beginPath();
    // for (var k = 0, length = mass.length; k<length; k++){
    //   ctx.moveTo(mass[k].position.x,mass[k].position.y);
    //   ctx.lineTo(mass[k].vertices[0].x, mass[k].vertices[0].y);
    // }
    // ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "300 20px Roboto";
    ctx.fillStyle = "#000";
    var p = 0;
    for (var k = 0, length = mass.length; k < length; k++) {
      ctx.fillText(mass[k].mass.toFixed(2) + "kg", mass[k].position.x, mass[k].position.y);
      p += mass[k].mass * mass[k].velocity.x;
    }
    // ctx.textAlign = "left";
    // ctx.fillText("mv + mv = total momentum", 5, 15);
    // ctx.fillText(
    //   "(" +
    //     mass[0].mass.toFixed(2) +
    //     ")(" +
    //     mass[0].velocity.x.toFixed(2) +
    //     ") + (" +
    //     mass[1].mass.toFixed(2) +
    //     ") (" +
    //     mass[1].velocity.x.toFixed(2) +
    //     ") = " +
    //     p.toFixed(2),
    //   5,
    //   37
    // );
    // ctx.textAlign="right";
    // ctx.fillText('mv + mv = total vertical momentum',canvas.width-5,13);
    // ctx.fillText('(' + mass[0].mass.toFixed(2)+')('+-mass[0].velocity.y.toFixed(2) +') + ('
    // +mass[1].mass.toFixed(2)+') ('+-mass[1].velocity.y.toFixed(2)+') = '      +py.toFixed(2),canvas.width-5,30);
  })();
}

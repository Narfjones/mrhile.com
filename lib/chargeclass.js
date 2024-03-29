var canvas, ctx;
class Charge {
  //charge class
  constructor(
    type,
    position,
    velocity = {
      x: 0,
      y: 0
    }
  ) {
    this.position = position;
    this.velocity = velocity;
    if (type === "e") {
      this.canMove = true;
      this.name = "electron";
      this.mass = 1;
      this.charge = -1;
      this.radius = 15;
      this.color = "rgba(0,100,255,0.4)";
      this.life = 100 + Math.floor(Math.random() * 500);
      this.wide = 0;
      this.speed = 0.13; // % of speed of light, c
    } else if (type === "p") {
      this.canMove = false;
      this.name = "proton";
      this.mass = 1000;
      this.charge = 1;
      this.radius = 4;
      this.color = "rgba(255,0,100,1)";
      this.life = Infinity;
      this.wide = 1;
      this.speed = 0; // % of speed of light, c  //note this p can't move, use proton
    } else if (type === "neutron") {
      this.canMove = true;
      this.name = "neutron";
      this.mass = 1001;
      this.charge = 0;
      this.radius = 4;
      this.color = "rgba(255,0,100,1)";
      this.life = 100 + Math.floor(Math.random() * 500);
      this.wide = 0;
      this.speed = 0;
    } else if (type === "muon") {
      this.canMove = true;
      this.name = "muon";
      this.mass = 207;
      this.charge = -1;
      this.radius = 8;
      this.color = "rgba(0,100,255,0.8)";
      this.life = 100 + Math.floor(Math.random() * 200);
      this.wide = 1;
      this.speed = 0.99; // % of speed of light, c
    } else if (type === "positron") {
      this.canMove = true;
      this.name = "positron";
      this.mass = 1;
      this.charge = 1;
      this.radius = 15;
      this.color = "rgba(255,0,100,0.4)";
      this.life = 100 + Math.floor(Math.random() * 500);
      this.wide = 0;
      this.speed = 0.13; // % of speed of light, c
    } else if (type === "alpha") {
      this.canMove = true;
      this.name = "alpha";
      this.mass = 4000;
      this.charge = 2;
      this.radius = 8;
      this.color = "rgba(255,0,100,0.4)";
      this.life = 30 + Math.floor(Math.random() * 25);
      this.wide = 6;
      this.speed = 0.05; // % of speed of light, c
    } else if (type === "proton") {
      this.canMove = true;
      this.name = "proton";
      this.mass = 1000;
      this.charge = 1;
      this.radius = 4;
      this.color = "rgba(255,0,100,1)";
      this.life = 100 + Math.floor(Math.random() * 300);
      this.wide = 1;
      this.speed = 0.43; // % of speed of light, c
    }
  }
  static spawnCharges(who, len = 1, type = "e") {
    for (let i = 0; i < len; ++i) {
      who[who.length] = new Charge(type, {
        x: 30 + Math.random() * (canvas.width - 60),
        y: 30 + Math.random() * (canvas.height - 60)
      });
    }
  }

  static setCanvas(el) {
    canvas = el;
    ctx = canvas.getContext("2d");
    ctx.font = "300 20px Roboto";
  }

  static drawAll(who) {
    for (let i = 0, len = who.length; i < len; ++i) {
      ctx.fillStyle = who[i].color;
      ctx.beginPath();
      ctx.arc(who[i].position.x, who[i].position.y, who[i].radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  static teleport(who, off = 200) {
    let count = 0;
    for (let i = 0, len = who.length; i < len; ++i) {
      if (who[i].canMove && who[i].position.x > canvas.width + off) {
        count++;
        who[i].position.x = -off;
      }
    }
    return count;
  }

  static bounds(who, range = 50) {
    //range = how far outside of canvas,  0 is at canvas edge
    for (let i = 0, len = who.length; i < len; ++i) {
      if (who[i].canMove) {
        if (who[i].position.x > canvas.width + range) {
          who[i].velocity.x = 0; //-Math.abs(who[i].velocity.x)
          who[i].position.x = canvas.width + range;
        } else if (who[i].position.x < -range) {
          who[i].velocity.x = 0; //Math.abs(who[i].velocity.x)
          who[i].position.x = -range;
        }
        if (who[i].position.y > canvas.height + range) {
          who[i].velocity.y = 0; //-Math.abs(who[i].velocity.y)
          who[i].position.y = canvas.height + range;
        } else if (who[i].position.y < -range) {
          who[i].velocity.y = 0; //Math.abs(who[i].velocity.y)
          who[i].position.y = -range;
        }
      }
    }
  }

  static isOnCanvas(who) {
    if (who.position.x > canvas.width || who.position.x < 0 || who.position.y > canvas.height || who.position.y < 0) {
      return false;
    } else {
      return true;
    }
  }

  static boundsRemove(who, range = 50) {
    //range = how far outside of canvas,  0 is at canvas edge

    for (let i = 0, len = who.length; i < len; ++i) {
      if (who[i]) {
        if (
          who[i].canMove &&
          (who[i].position.x > canvas.width + range || who[i].position.x < -range || who[i].position.y > canvas.height + range || who[i].position.y < -range)
        ) {
          who.splice(i, 1);
        }
      }
    }

    // let i = who.length;
    // while (--i) {
    //   if (
    //     who[i].canMove &&
    //     (who[i].position.x > canvas.width + range || who[i].position.x < -range || who[i].position.y > canvas.height + range || who[i].position.y < -range)
    //   ) {
    //     who.splice(i, 1);
    //   }
    // }
    //fixes issue where the last particle isn't being removed ... be nice to have a better solution, but this works
    // if (
    //   who[0].canMove &&
    //   (who[0].position.x > canvas.width + range || who[0].position.x < -range || who[0].position.y > canvas.height + range || who[0].position.y < -range)
    // ) {
    //   who.splice(0, 1);
    // }
  }

  static physicsAll(who, friction = 0.99, minDistance2 = 500, strength = 200) {
    for (let i = 0, len = who.length; i < len; ++i) {
      if (who[i].canMove) {
        //change position from velocity
        who[i].position.x += who[i].velocity.x;
        who[i].position.y += who[i].velocity.y;
        //friction
        who[i].velocity.x *= friction;
        who[i].velocity.y *= friction;
        //accelerate from electrostatic force
        for (let j = 0, len = who.length; j < len; ++j) {
          if (i != j) {
            const dx = who[i].position.x - who[j].position.x;
            const dy = who[i].position.y - who[j].position.y;
            // const d2 = Math.max(dx * dx + dy * dy, minDistance2);  // better accuracy, like for orbits
            const d2 = dx * dx + dy * dy + minDistance2; // + minDistance2 leads to more stability
            const mag = (strength * who[i].charge * who[j].charge) / (d2 * Math.sqrt(d2));
            who[i].velocity.x += (mag * dx) / who[i].mass;
            who[i].velocity.y += (mag * dy) / who[i].mass;
          }
        }
      }
    }
  }

  static physicsMagneticField(who, B) {
    for (let i = 0, len = who.length; i < len; ++i) {
      if (who[i].canMove && who[i].charge) {
        // const velocity = Math.sqrt(who[i].velocity.x * who[i].velocity.x + who[i].velocity.y * who[i].velocity.y);
        // assumes the magnetic field, B, is either in or out of the page
        who[i].velocity.x -= (who[i].charge * B * who[i].velocity.y) / who[i].mass;
        who[i].velocity.y += (who[i].charge * B * who[i].velocity.x) / who[i].mass;
      }
    }
  }

  // static magnetic(who, scale = 0.05) {
  //   for (let i = 0, len = who.length; i < len; ++i) {
  //     let dir = Math.atan2(who[i].velocity.y, who[i].velocity.x);
  //     let angle = dir + (Math.PI / 2) * who[i].charge;
  //     let speed = Math.sqrt(who[i].velocity.x * who[i].velocity.x + who[i].velocity.y * who[i].velocity.y);
  //     let mag = scale * speed;
  //     who[i].velocity.x += mag * Math.cos(angle);
  //     who[i].velocity.y += mag * Math.sin(angle);
  //   }
  // }

  static drawCloudChamber(who, falling = false) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    // let imgData = ctx.createImageData(canvasWidth, canvasHeight);
    let imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imgData.data;

    //add streaks for particles
    for (let i = 0, len = who.length; i < len; ++i) {
      //draw path of particles
      if (who[i].canMove && Charge.isOnCanvas(who[i])) {
        const velocity2 = who[i].velocity.x * who[i].velocity.x + who[i].velocity.y * who[i].velocity.y;
        const energyCycles = 2 + Math.floor(0.003 * who[i].mass * velocity2);
        const imgIndex = 4 * (Math.floor(who[i].position.x) + Math.floor(who[i].position.y) * canvasWidth);
        const alpha = Math.min(255, Math.max(0, 500 * velocity2));

        for (let j = 0; j < energyCycles; ++j) {
          const mag = who[i].wide * Math.random();
          const angle = Math.PI * 2 * Math.random();
          //adds marks to where the particle was and will be to make the pattern less periodic
          const velocityMag = Math.random();
          const x = mag * Math.cos(angle) - who[i].velocity.x * velocityMag;
          const y = mag * Math.sin(angle) - who[i].velocity.y * velocityMag;
          const off = 4 * Math.floor(x) + 4 * canvasWidth * Math.floor(y);
          data[imgIndex + 0 + off] = 255; // red
          data[imgIndex + 1 + off] = 255; // green
          data[imgIndex + 2 + off] = 255; // blue
          // data[imgIndex + 3 + off] = 255; //255; //velocity;  // alpha
          data[imgIndex + 3 + off] = alpha;
        }
      }
    }

    // fade alpha for all pixels
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i + 3]--;
      }
    }

    //add random speckles
    for (let i = 0, len = Math.floor(data.length / 15000); i < len; ++i) {
      const index = Math.floor((Math.random() * data.length) / 4) * 4;
      data[index + 0] = 255; // red
      data[index + 1] = 255; // green
      data[index + 2] = 255; // blue
      data[index + 3] = Math.floor(Math.random() * Math.random() * 155); // alpha
    }

    if (falling) {
      ctx.putImageData(imgData, 0, 1); //pixels fall because of the 1 in third parameter
    } else {
      ctx.putImageData(imgData, 0, 0);
    }
  }

  static drawMagneticField(B) {
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.3;
    var steps = 30 / Math.pow(Math.abs(B), 0.2);
    var text;
    if (B < 0) {
      for (var i = 0; i < canvas.width; i += steps) {
        for (var j = 0; j < canvas.height; j += steps) {
          ctx.beginPath();
          ctx.arc(i, j, 10, 0, 2 * Math.PI);
          ctx.moveTo(i + 7, j + 7);
          ctx.lineTo(i - 7, j - 7);
          ctx.moveTo(i - 7, j + 7);
          ctx.lineTo(i + 7, j - 7);
          ctx.stroke();
        }
      }
    } else if (B > 0) {
      for (var i = 0; i < canvas.width; i += steps) {
        for (var j = 0; j < canvas.height; j += steps) {
          ctx.beginPath();
          ctx.arc(i, j, 10, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(i, j, 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // static physicsAll(who) {
  //   const minDistance2 = 1000;
  //   for (let i = 0, len = who.length; i < len; ++i) {
  //     if (who[i].canMove) {
  //       //change position from velocity
  //       who[i].position.x += who[i].velocity.x;
  //       who[i].position.y += who[i].velocity.y;
  //       //friction
  //       who[i].velocity.x *= 0.99;
  //       who[i].velocity.y *= 0.99;
  //       //accelerate from electrostatic force
  //       for (let j = 0, len = who.length; j < len; ++j) {
  //         if (i != j) {
  //           const dx = who[i].position.x - who[j].position.x;
  //           const dy = who[i].position.y - who[j].position.y;
  //           const d2 = Math.max(dx * dx + dy * dy, minDistance2);
  //           const mag = 200 * who[i].charge * who[j].charge / (d2 * Math.sqrt(d2));
  //           who[i].velocity.x += mag * dx;
  //           who[i].velocity.y += mag * dy;
  //         }
  //       }
  //     }
  //   }
  // }

  // static physicsAll(who) {
  //   for (let i = 0, len = who.length; i < len; ++i) {
  //     if (who[i].canMove) {
  //       //move
  //       who[i].position.x += who[i].velocity.x;
  //       who[i].position.y += who[i].velocity.y;
  //       //friction
  //       who[i].velocity.x *= 0.99;
  //       who[i].velocity.y *= 0.99;
  //       //electrostatic force
  //       for (let j = 0, len = who.length; j < len; ++j) {
  //         if (j < i) {
  //           const dx = who[i].position.x - who[j].position.x;
  //           const dy = who[i].position.y - who[j].position.y;
  //           const a = Math.atan2(dy, dx);
  //           const r = dx * dx + dy * dy + 1000; //the +1000 keeps r from being zero / adds stability
  //           const mag = 200 * who[i].charge * who[j].charge / r;
  //           who[i].velocity.x += mag * Math.cos(a);
  //           who[i].velocity.y += mag * Math.sin(a);
  //           who[j].velocity.x -= mag * Math.cos(a);
  //           who[j].velocity.y -= mag * Math.sin(a);
  //         }
  //       }
  //     }
  //   }
  // }

  static pushZone(who, offx = 0, offy = 50, height = 300, push = 0.1) {
    const range = {
      min: {
        x: offx - 50,
        y: offy
      },
      max: {
        x: offx + 50,
        y: offy + height
      }
    };
    //draw push
    ctx.beginPath();
    ctx.moveTo(range.min.x, range.min.y);
    ctx.lineTo(range.min.x, range.max.y);
    ctx.lineTo(range.max.x, range.max.y);
    ctx.lineTo(range.max.x, range.min.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();
    ctx.stroke();
    // ctx.strokeStyle = "#000";
    // ctx.stroke();
    //push electrons
    for (let i = 0, len = who.length; i < len; ++i) {
      if (
        who[i].canMove &&
        who[i].position.x < range.max.x &&
        who[i].position.x > range.min.x &&
        who[i].position.y < range.max.y &&
        who[i].position.y > range.min.y
      ) {
        who[i].velocity.y += push;
      }
    }
  }
  static slow(range, who) {
    //draw slow
    ctx.beginPath();
    ctx.moveTo(range.min.x, range.min.y);
    ctx.lineTo(range.min.x, range.max.y);
    ctx.lineTo(range.max.x, range.max.y);
    ctx.lineTo(range.max.x, range.min.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();
    //slow electrons
    for (let i = 0, len = who.length; i < len; ++i) {
      if (
        who[i].canMove &&
        who[i].position.x < range.max.x &&
        who[i].position.x > range.min.x &&
        who[i].position.y < range.max.y &&
        who[i].position.y > range.min.y
      ) {
        who[i].velocity.x *= 0.8;
        who[i].velocity.y *= 0.8;
      }
    }
  }

  static repulse(who, pos) {
    for (let i = 0, len = who.length; i < len; ++i) {
      if (who[i].canMove) {
        const dx = who[i].position.x - pos.x;
        const dy = who[i].position.y - pos.y;
        const a = Math.atan2(dy, dx);
        //the +4000 keeps r from being zero
        const r = dx * dx + dy * dy + 4000;
        const mag = 30000 / r;
        who[i].velocity.x += mag * Math.cos(a);
        who[i].velocity.y += mag * Math.sin(a);
      }
    }
  }

  static potential(who, position) {
    let v = 0;
    for (let i = 0, len = who.length; i < len; ++i) {
      const dx = who[i].position.x - position.x;
      const dy = who[i].position.y - position.y;
      // const a = Math.atan2(dy, dx);
      // //the +4000 keeps r from being zero / adds stability
      // const r = (dx * dx + dy * dy) + 4000
      // v += 200 * who[i].charge / r;

      v += who[i].charge / Math.sqrt(dx * dx + dy * dy + 4000);
    }
    return v;
  }

  static vectorField(who, spacing = 15) {
    var lenX = Math.floor(canvas.width / spacing);
    var lenY = Math.floor(canvas.height / spacing);
    var x, y, dist, draw;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#033";
    for (var k = 0; k < lenY; k++) {
      for (var j = 0; j < lenX; j++) {
        draw = true;
        x = (canvas.width * (j + 0.5)) / lenX;
        y = (canvas.height * (k + 0.5)) / lenY;
        //calc Forces
        var f, a;
        var fx = 0;
        var fy = 0;
        for (var i = 0; i < who.length; i++) {
          var dx = who[i].position.x - x;
          var dy = who[i].position.y - y;
          dist = Math.sqrt(dx * dx + dy * dy) + 1000;
          if (dist < who[i].r) {
            draw = false; //don't draw in inside a body
            break; //exit the forloop
          }
          f = (-who[i].charge * 6000000) / (dist * dist);
          a = Math.atan2(dy, dx);
          fx += f * Math.cos(a);
          fy += f * Math.sin(a);
        }
        if (draw) {
          f = Math.sqrt(fx * fx + fy * fy);
          if (f > spacing - 5) f = spacing - 5;
          a = Math.atan2(fy, fx);
          var alpha = 1;
          if (f < 6) alpha = f / 6;
          ctx.globalAlpha = alpha * alpha;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(a);
          //vector line
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.abs(f), 0);
          ctx.stroke();
          //arrows
          ctx.beginPath();
          ctx.moveTo(f + 4, 0);
          ctx.lineTo(f, -2);
          ctx.lineTo(f, 2);
          ctx.fillStyle = "#033";
          ctx.fill();
          ctx.restore();
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  static scalarField(who) {
    const fieldMag = 1000;
    const chromaBytes = [
      [0x88, 0x00, 0x00],
      [0x8b, 0x00, 0x00],
      [0x8f, 0x00, 0x01],
      [0x93, 0x00, 0x01],
      [0x96, 0x00, 0x01],
      [0x9a, 0x00, 0x02],
      [0x9d, 0x00, 0x02],
      [0xa1, 0x00, 0x02],
      [0xa4, 0x00, 0x02],
      [0xa8, 0x00, 0x02],
      [0xac, 0x00, 0x02],
      [0xaf, 0x00, 0x02],
      [0xb3, 0x00, 0x02],
      [0xb7, 0x00, 0x02],
      [0xbb, 0x00, 0x02],
      [0xbe, 0x00, 0x02],
      [0xc2, 0x00, 0x02],
      [0xc6, 0x00, 0x02],
      [0xc9, 0x00, 0x02],
      [0xcd, 0x00, 0x02],
      [0xd1, 0x00, 0x02],
      [0xd5, 0x00, 0x02],
      [0xd9, 0x00, 0x02],
      [0xdc, 0x00, 0x01],
      [0xe0, 0x00, 0x01],
      [0xe4, 0x00, 0x01],
      [0xe8, 0x00, 0x01],
      [0xec, 0x00, 0x01],
      [0xf0, 0x00, 0x01],
      [0xf4, 0x00, 0x01],
      [0xf8, 0x00, 0x00],
      [0xfc, 0x00, 0x00],
      [0xff, 0x02, 0x00],
      [0xff, 0x13, 0x00],
      [0xff, 0x1e, 0x00],
      [0xff, 0x25, 0x00],
      [0xff, 0x2c, 0x00],
      [0xff, 0x32, 0x00],
      [0xff, 0x37, 0x00],
      [0xff, 0x3c, 0x00],
      [0xff, 0x40, 0x00],
      [0xff, 0x44, 0x00],
      [0xff, 0x48, 0x00],
      [0xff, 0x4c, 0x00],
      [0xff, 0x50, 0x00],
      [0xff, 0x53, 0x00],
      [0xff, 0x56, 0x00],
      [0xff, 0x5a, 0x00],
      [0xff, 0x5d, 0x00],
      [0xff, 0x60, 0x00],
      [0xff, 0x63, 0x00],
      [0xff, 0x66, 0x00],
      [0xff, 0x69, 0x00],
      [0xff, 0x6c, 0x00],
      [0xff, 0x6f, 0x00],
      [0xff, 0x71, 0x00],
      [0xff, 0x74, 0x00],
      [0xff, 0x77, 0x00],
      [0xff, 0x79, 0x00],
      [0xff, 0x7c, 0x00],
      [0xff, 0x7f, 0x00],
      [0xff, 0x81, 0x00],
      [0xff, 0x84, 0x00],
      [0xff, 0x86, 0x00],
      [0xff, 0x89, 0x00],
      [0xff, 0x8c, 0x00],
      [0xff, 0x8e, 0x00],
      [0xff, 0x91, 0x00],
      [0xff, 0x94, 0x00],
      [0xff, 0x97, 0x00],
      [0xff, 0x9a, 0x00],
      [0xff, 0x9c, 0x00],
      [0xff, 0x9f, 0x00],
      [0xff, 0xa2, 0x00],
      [0xff, 0xa5, 0x00],
      [0xff, 0xa7, 0x00],
      [0xff, 0xaa, 0x00],
      [0xff, 0xad, 0x00],
      [0xff, 0xaf, 0x00],
      [0xff, 0xb2, 0x00],
      [0xff, 0xb5, 0x00],
      [0xff, 0xb7, 0x00],
      [0xff, 0xba, 0x00],
      [0xff, 0xbc, 0x00],
      [0xff, 0xbf, 0x00],
      [0xff, 0xc2, 0x00],
      [0xff, 0xc4, 0x00],
      [0xff, 0xc7, 0x00],
      [0xff, 0xc9, 0x00],
      [0xff, 0xcc, 0x00],
      [0xff, 0xcf, 0x00],
      [0xff, 0xd1, 0x00],
      [0xff, 0xd4, 0x00],
      [0xff, 0xd6, 0x00],
      [0xff, 0xd9, 0x00],
      [0xff, 0xdb, 0x00],
      [0xff, 0xdd, 0x0e],
      [0xff, 0xde, 0x22],
      [0xff, 0xdf, 0x30],
      [0xff, 0xe0, 0x3b],
      [0xff, 0xe1, 0x44],
      [0xff, 0xe2, 0x4d],
      [0xff, 0xe3, 0x55],
      [0xff, 0xe4, 0x5d],
      [0xff, 0xe5, 0x65],
      [0xff, 0xe6, 0x6c],
      [0xff, 0xe7, 0x73],
      [0xff, 0xe8, 0x7a],
      [0xff, 0xe9, 0x81],
      [0xff, 0xeb, 0x88],
      [0xff, 0xec, 0x8e],
      [0xff, 0xed, 0x95],
      [0xff, 0xee, 0x9b],
      [0xff, 0xef, 0xa2],
      [0xff, 0xf0, 0xa9],
      [0xff, 0xf1, 0xaf],
      [0xff, 0xf2, 0xb5],
      [0xff, 0xf3, 0xbc],
      [0xff, 0xf4, 0xc2],
      [0xff, 0xf5, 0xc9],
      [0xff, 0xf6, 0xcf],
      [0xff, 0xf8, 0xd5],
      [0xff, 0xf9, 0xdc],
      [0xff, 0xfa, 0xe2],
      [0xff, 0xfb, 0xe9],
      [0xff, 0xfc, 0xef],
      [0xff, 0xfd, 0xf5],
      [0xff, 0xfe, 0xfc],
      [0xfd, 0xfe, 0xff],
      [0xf8, 0xfd, 0xff],
      [0xf3, 0xfc, 0xff],
      [0xee, 0xfb, 0xff],
      [0xea, 0xfa, 0xff],
      [0xe5, 0xf9, 0xff],
      [0xe0, 0xf8, 0xff],
      [0xdb, 0xf7, 0xff],
      [0xd6, 0xf6, 0xff],
      [0xd1, 0xf5, 0xff],
      [0xcc, 0xf4, 0xff],
      [0xc6, 0xf3, 0xff],
      [0xc1, 0xf2, 0xff],
      [0xbc, 0xf1, 0xff],
      [0xb6, 0xf0, 0xff],
      [0xb0, 0xef, 0xff],
      [0xab, 0xee, 0xff],
      [0xa5, 0xed, 0xff],
      [0x9f, 0xec, 0xff],
      [0x98, 0xeb, 0xff],
      [0x92, 0xea, 0xff],
      [0x8b, 0xe9, 0xff],
      [0x84, 0xe7, 0xff],
      [0x7d, 0xe6, 0xff],
      [0x75, 0xe5, 0xff],
      [0x6d, 0xe4, 0xff],
      [0x64, 0xe3, 0xff],
      [0x5a, 0xe2, 0xff],
      [0x4f, 0xe1, 0xff],
      [0x42, 0xe0, 0xff],
      [0x31, 0xdf, 0xff],
      [0x17, 0xdd, 0xff],
      [0x04, 0xdb, 0xff],
      [0x0a, 0xd9, 0xff],
      [0x0f, 0xd6, 0xff],
      [0x13, 0xd3, 0xff],
      [0x16, 0xd0, 0xff],
      [0x18, 0xce, 0xff],
      [0x1a, 0xcb, 0xff],
      [0x1b, 0xc8, 0xff],
      [0x1d, 0xc6, 0xff],
      [0x1e, 0xc3, 0xff],
      [0x1f, 0xc0, 0xff],
      [0x1f, 0xbe, 0xff],
      [0x20, 0xbb, 0xff],
      [0x20, 0xb8, 0xff],
      [0x21, 0xb6, 0xff],
      [0x21, 0xb3, 0xff],
      [0x20, 0xb0, 0xff],
      [0x20, 0xae, 0xff],
      [0x20, 0xab, 0xff],
      [0x1f, 0xa8, 0xff],
      [0x1e, 0xa6, 0xff],
      [0x1d, 0xa3, 0xff],
      [0x1c, 0xa0, 0xff],
      [0x1b, 0x9e, 0xff],
      [0x19, 0x9b, 0xff],
      [0x18, 0x98, 0xff],
      [0x15, 0x96, 0xff],
      [0x13, 0x93, 0xff],
      [0x10, 0x91, 0xff],
      [0x0c, 0x8e, 0xff],
      [0x07, 0x8b, 0xff],
      [0x01, 0x89, 0xff],
      [0x06, 0x86, 0xff],
      [0x0d, 0x83, 0xff],
      [0x12, 0x80, 0xff],
      [0x16, 0x7d, 0xff],
      [0x19, 0x7a, 0xff],
      [0x1b, 0x77, 0xff],
      [0x1d, 0x73, 0xff],
      [0x1f, 0x70, 0xff],
      [0x20, 0x6d, 0xff],
      [0x21, 0x6a, 0xff],
      [0x22, 0x67, 0xff],
      [0x23, 0x64, 0xff],
      [0x24, 0x61, 0xff],
      [0x24, 0x5d, 0xff],
      [0x24, 0x5a, 0xff],
      [0x24, 0x57, 0xff],
      [0x24, 0x53, 0xff],
      [0x24, 0x50, 0xff],
      [0x23, 0x4c, 0xff],
      [0x22, 0x48, 0xff],
      [0x22, 0x45, 0xff],
      [0x21, 0x41, 0xff],
      [0x1f, 0x3d, 0xff],
      [0x1e, 0x39, 0xff],
      [0x1c, 0x34, 0xff],
      [0x1a, 0x30, 0xff],
      [0x18, 0x2b, 0xff],
      [0x15, 0x26, 0xff],
      [0x11, 0x1f, 0xff],
      [0x0d, 0x18, 0xff],
      [0x07, 0x0f, 0xff],
      [0x01, 0x02, 0xff],
      [0x00, 0x00, 0xfc],
      [0x00, 0x00, 0xf8],
      [0x00, 0x00, 0xf4],
      [0x00, 0x00, 0xf0],
      [0x00, 0x00, 0xec],
      [0x00, 0x00, 0xe8],
      [0x00, 0x00, 0xe4],
      [0x00, 0x00, 0xe0],
      [0x00, 0x00, 0xdd],
      [0x00, 0x00, 0xd9],
      [0x00, 0x00, 0xd5],
      [0x00, 0x00, 0xd1],
      [0x00, 0x00, 0xcd],
      [0x00, 0x00, 0xca],
      [0x00, 0x00, 0xc6],
      [0x00, 0x00, 0xc2],
      [0x00, 0x00, 0xbe],
      [0x00, 0x00, 0xbb],
      [0x00, 0x00, 0xb7],
      [0x00, 0x00, 0xb3],
      [0x00, 0x00, 0xaf],
      [0x00, 0x00, 0xac],
      [0x00, 0x00, 0xa8],
      [0x00, 0x00, 0xa5],
      [0x00, 0x00, 0xa1],
      [0x00, 0x00, 0x9d],
      [0x00, 0x00, 0x9a],
      [0x00, 0x00, 0x96],
      [0x00, 0x00, 0x93],
      [0x00, 0x00, 0x8f],
      [0x00, 0x00, 0x8c],
      [0x00, 0x00, 0x88]
    ];

    let imageData = ctx.createImageData(canvas.width, canvas.height);
    // var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    let data = imageData.data;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    for (let y = 0; y < canvasHeight; ++y) {
      for (let x = 0; x < canvasWidth; x += 2) {
        const index = (y * canvasWidth + x) * 4;
        let mag = 0;
        for (let j = 0, len = who.length; j < len; j++) {
          const dx = who[j].position.x - x;
          const dy = who[j].position.y - y;
          mag -= who[j].charge / (Math.sqrt(dx * dx + dy * dy) + 1);
        }
        let hue = Math.min(Math.max(Math.round(mag * fieldMag) + 128, 0), 255);
        for (let k = 0; k < 8; k += 4) {
          //make pixels 2 wide
          data[index + k + 0] = chromaBytes[hue][0]; // red
          data[index + k + 1] = chromaBytes[hue][1]; // green
          data[index + k + 2] = chromaBytes[hue][2]; // blue
          data[index + k + 3] = 255; // alpha
        }
      }
    }
    // for (var i = 0; i < data.length; i += 8) {
    //   const x = (i / 4) % canvasWidth;
    //   const y = Math.floor(i / 4 / canvasWidth);
    //   let mag = 0;
    //   for (let j = 0, len = who.length; j < len; j++) {
    //     const dx = who[j].position.x - x;
    //     const dy = who[j].position.y - y;
    //     mag -= who[j].charge / (Math.sqrt(dx * dx + dy * dy) + 1);
    //   }
    //   let hue = Math.min(Math.max(Math.round(mag * fieldMag) + 128, 0), 255);
    //   for (let k = 0; k < 8; k += 4) {
    //     //make pixels bigger, is this really worth it?
    //     data[i + k + 0] = chromaBytes[hue][0]; // red
    //     data[i + k + 1] = chromaBytes[hue][1]; // green
    //     data[i + k + 2] = chromaBytes[hue][2]; // blue
    //     data[i + k + 3] = 255; // alpha
    //   }
    // }
    ctx.putImageData(imageData, 0, 0);
  }
}

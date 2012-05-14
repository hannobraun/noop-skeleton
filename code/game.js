// Generated by CoffeeScript 1.3.1
(function() {

  window.define = function(moduleName, dependencyNames, moduleFactory) {
    if (window.modules == null) {
      window.modules = {};
    }
    if (window.modules[moduleName] == null) {
      return window.modules[moduleName] = {
        name: moduleName,
        dependencyNames: dependencyNames,
        factory: moduleFactory
      };
    } else {
      throw "Module " + moduleName + " is already defined.";
    }
  };

  window.load = function(moduleName, loadedModules) {
    var dependencies, dependencyName, module;
    if (window.modules == null) {
      throw "No modules have been defined.";
    }
    if (window.modules[moduleName] == null) {
      throw "A module called " + moduleName + " does not exist.";
    }
    if (loadedModules == null) {
      loadedModules = {};
    }
    if (loadedModules[moduleName] == null) {
      module = window.modules[moduleName];
      dependencies = (function() {
        var _i, _len, _ref, _results;
        _ref = module.dependencyNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dependencyName = _ref[_i];
          if (modules[dependencyName] == null) {
            throw ("A module called \"" + dependencyName + "\" (defined as a ") + ("dependency in \"" + moduleName + "\") does not exist.");
          }
          _results.push(load(dependencyName, loadedModules));
        }
        return _results;
      })();
      loadedModules[moduleName] = module.factory.apply(void 0, dependencies);
    }
    return loadedModules[moduleName];
  };

  define("Transform2d", [], function() {
    var module;
    return module = {
      identityMatrix: function() {
        return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      },
      translationMatrix: function(v) {
        return [[1, 0, v[0]], [0, 1, v[1]], [0, 0, 1]];
      },
      rotationMatrix: function(angle) {
        return [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0, 1]];
      },
      scalingMatrix: function(factor) {
        return [[factor, 0, 0], [0, factor, 0], [0, 0, 1]];
      }
    };
  });

  define("Entities", [], function() {
    var module;
    return module = {
      createEntity: function(factories, components, type, args) {
        var component, componentName, entity, _ref, _results;
        entity = factories[type](args);
        _ref = entity.components;
        _results = [];
        for (componentName in _ref) {
          component = _ref[componentName];
          if (!components[componentName]) {
            components[componentName] = {};
          }
          _results.push(components[componentName][entity.id] = component);
        }
        return _results;
      },
      destroyEntity: function(components, entityId) {
        var componentMap, componentType, _results;
        _results = [];
        for (componentType in components) {
          componentMap = components[componentType];
          _results.push(delete componentMap[entityId]);
        }
        return _results;
      }
    };
  });

  define("Images", [], function() {
    var module;
    return module = {
      loadImages: function(imagePaths, onLoad) {
        var image, imagePath, images, numberOfImagesToLoad, _i, _len, _results;
        images = {};
        numberOfImagesToLoad = imagePaths.length;
        _results = [];
        for (_i = 0, _len = imagePaths.length; _i < _len; _i++) {
          imagePath = imagePaths[_i];
          image = new Image;
          images[imagePath] = image;
          image.onload = function() {
            numberOfImagesToLoad -= 1;
            if (numberOfImagesToLoad === 0) {
              return onLoad(images);
            }
          };
          _results.push(image.src = imagePath);
        }
        return _results;
      },
      process: function(rawImages) {
        var imageId, images, rawImage;
        images = {};
        for (imageId in rawImages) {
          rawImage = rawImages[imageId];
          images[imageId] = {
            rawImage: rawImage,
            positionOffset: [-rawImage.width / 2, -rawImage.height / 2],
            orientationOffset: 0
          };
        }
        return images;
      }
    };
  });

  define("VelocityVerletIntegrator", [], function() {
    var module;
    return module = {
      integrate: function(bodies, passedTimeInS) {
        var body, entityId, force, movementFromAcceleration, movementFromVelocity, newAcceleration, velocityChange, _i, _len, _ref, _results;
        _results = [];
        for (entityId in bodies) {
          body = bodies[entityId];
          newAcceleration = [0, 0];
          _ref = body.forces;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            force = _ref[_i];
            Vec2.scale(force, 1 / body.mass);
            Vec2.add(newAcceleration, force);
          }
          body.forces.length = 0;
          movementFromVelocity = Vec2.copy(body.velocity);
          Vec2.scale(movementFromVelocity, passedTimeInS);
          movementFromAcceleration = Vec2.copy(body.acceleration);
          Vec2.scale(movementFromAcceleration, 0.5);
          Vec2.scale(movementFromAcceleration, passedTimeInS * passedTimeInS);
          Vec2.add(body.position, movementFromVelocity);
          Vec2.add(body.position, movementFromAcceleration);
          velocityChange = Vec2.copy(body.acceleration);
          Vec2.add(velocityChange, newAcceleration);
          Vec2.scale(velocityChange, 0.5);
          Vec2.scale(velocityChange, passedTimeInS);
          Vec2.add(body.velocity, velocityChange);
          _results.push(body.acceleration = newAcceleration);
        }
        return _results;
      }
    };
  });

  define("EulerIntegrator", [], function() {
    var module;
    return module = {
      integrate: function(bodies, passedTimeInS) {
        var body, entityId, force, newAcceleration, positionChange, velocityChange, _i, _len, _ref, _results;
        _results = [];
        for (entityId in bodies) {
          body = bodies[entityId];
          newAcceleration = [0, 0];
          _ref = body.forces;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            force = _ref[_i];
            Vec2.scale(force, 1 / body.mass);
            Vec2.add(newAcceleration, force);
          }
          body.forces.length = 0;
          body.acceleration = newAcceleration;
          velocityChange = Vec2.copy(body.acceleration);
          Vec2.scale(velocityChange, passedTimeInS);
          Vec2.add(body.velocity, velocityChange);
          positionChange = Vec2.copy(body.velocity);
          Vec2.scale(positionChange, passedTimeInS);
          _results.push(Vec2.add(body.position, positionChange));
        }
        return _results;
      }
    };
  });

  define("CollisionResponse", [], function() {
    var module;
    return module = {
      handleContacts: function(contacts, bodies, parameters) {
        var b, bodyA, bodyB, contact, damping, force, k, negativeForce, relativeVelocity, spring, _i, _len, _results;
        k = parameters.k;
        b = parameters.b;
        _results = [];
        for (_i = 0, _len = contacts.length; _i < _len; _i++) {
          contact = contacts[_i];
          bodyA = bodies[contact.bodyIds[0]];
          bodyB = bodies[contact.bodyIds[1]];
          relativeVelocity = Vec2.copy(bodyA.velocity);
          Vec2.subtract(relativeVelocity, bodyB.velocity);
          spring = Vec2.copy(contact.normal);
          Vec2.scale(spring, -k * contact.depth);
          damping = Vec2.copy(contact.normal);
          Vec2.scale(damping, b * Vec2.dot(contact.normal, relativeVelocity));
          force = Vec2.copy(spring);
          Vec2.add(force, damping);
          Vec2.scale(force, 0.5);
          negativeForce = Vec2.copy(force);
          Vec2.scale(negativeForce, -1);
          bodyA.forces.push(force);
          _results.push(bodyB.forces.push(negativeForce));
        }
        return _results;
      }
    };
  });

  define("Physics", ["Vec2"], function(Vec2) {
    var module;
    return module = {
      parameters: {
        collisionResponse: {
          k: 10000,
          b: 0
        }
      },
      createBody: function() {
        var body;
        return body = {
          position: [0, 0],
          velocity: [0, 0],
          acceleration: [0, 0],
          orientation: 0,
          angularVelocity: 0,
          forces: [],
          mass: 1
        };
      },
      integrateOrientation: function(bodies, passedTimeInS) {
        var body, entityId, _results;
        _results = [];
        for (entityId in bodies) {
          body = bodies[entityId];
          _results.push(body.orientation += body.angularVelocity * passedTimeInS);
        }
        return _results;
      },
      update: function(bodies, passedTimeInS, integrate) {
        integrate(bodies, passedTimeInS);
        module.integrateOrientation(bodies, passedTimeInS);
        return module.applyForces(bodies);
      }
    };
  });

  define("CollisionDetection", ["Vec2"], function(Vec2) {
    var module;
    return module = {
      createCircle: function(radius) {
        var shape;
        return shape = {
          type: "circle",
          radius: radius
        };
      },
      buildPairs: function(shapes) {
        var entityIdA, entityIdB, entityUsed, pairs, shapeA, shapeB;
        entityUsed = {};
        pairs = [];
        for (entityIdA in shapes) {
          shapeA = shapes[entityIdA];
          entityUsed[entityIdA] = true;
          for (entityIdB in shapes) {
            shapeB = shapes[entityIdB];
            if (!entityUsed[entityIdB]) {
              pairs.push([entityIdA, entityIdB]);
            }
          }
        }
        return pairs;
      },
      checkCollisions: function(potentialPairs, bodies, shapes) {
        var collision, contacts, d, distance, normal, pair, penetrationDepth, point, positionA, positionB, shapeA, shapeB, sumOfRadii, _i, _len;
        contacts = [];
        for (_i = 0, _len = potentialPairs.length; _i < _len; _i++) {
          pair = potentialPairs[_i];
          positionA = bodies[pair[0]].position;
          positionB = bodies[pair[1]].position;
          shapeA = shapes[0];
          shapeB = shapes[1];
          sumOfRadii = shapeA.radius + shapeB.radius;
          d = Vec2.copy(positionB);
          Vec2.subtract(d, positionA);
          distance = Vec2.length(d);
          collision = sumOfRadii >= distance;
          if (collision) {
            normal = Vec2.copy(d);
            Vec2.unit(normal);
            penetrationDepth = sumOfRadii - distance;
            point = Vec2.copy(normal);
            Vec2.scale(point, shapeA.radius - penetrationDepth / 2);
            Vec2.add(point, positionA);
            contacts.push({
              bodyIds: pair,
              normal: normal,
              depth: penetrationDepth,
              point: point
            });
          }
        }
        return contacts;
      }
    };
  });

  define("Rendering", [], function() {
    var module;
    return module = {
      drawFunctions: {
        "image": function(renderable, context, image) {
          context.translate(renderable.position[0], renderable.position[1]);
          context.rotate(renderable.orientation + image.orientationOffset);
          context.translate(image.positionOffset[0], image.positionOffset[1]);
          return context.drawImage(image.rawImage, 0, 0);
        },
        "circle": function(renderable, context, shape) {
          context.translate(renderable.position[0], renderable.position[1]);
          context.rotate(renderable.orientation);
          context.translate(shape.offset[0], shape.offset[1]);
          context.beginPath();
          context.arc(0, 0, shape.circle.radius, 0, Math.PI * 2, true);
          return context.stroke();
        },
        "ellipse": function(renderable, context, ellipse) {
          context.strokeStyle = ellipse.color;
          context.translate(renderable.position[0], renderable.position[1]);
          context.rotate(renderable.orientation);
          context.scale(ellipse.semiMajorAxis / ellipse.semiMinorAxis, 1);
          context.beginPath();
          context.arc(0, 0, ellipse.semiMinorAxis, 0, 2 * Math.PI, false);
          context.stroke();
          return context.closePath();
        },
        "rectangle": function(renderable, context, rectangle) {
          context.fillStyle = rectangle.color || "rgb(255,255,255)";
          return context.fillRect(renderable.position[0], renderable.position[1], rectangle.size[0], rectangle.size[1]);
        },
        "rectangleOutline": function(renderable, context, rectangle) {
          context.strokeStyle = rectangle.color || "rgb(0,0,0)";
          return context.strokeRect(renderable.position[0], renderable.position[1], rectangle.size[0], rectangle.size[1]);
        },
        "line": function(renderable, context, line) {
          context.strokeStyle = line.color || "rgb(255,255,255)";
          context.beginPath();
          context.moveTo(line.start[0], line.start[1]);
          context.lineTo(line.end[0], line.end[1]);
          context.closePath();
          return context.stroke();
        },
        "text": function(renderable, context, text) {
          context.fillStyle = text.color || "rgb(0,0,0)";
          if (text.font != null) {
            context.font = text.font;
          }
          if (text.bold != null) {
            context.font = "bold " + context.font;
          }
          return context.fillText(text.string, renderable.position[0], renderable.position[1]);
        }
      },
      createDisplay: function() {
        var canvas, context, display;
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.translate(canvas.width / 2, canvas.height / 2);
        return display = {
          context: context,
          size: [canvas.width, canvas.height]
        };
      },
      createRenderable: function(type) {
        var renderable;
        return renderable = {
          type: type,
          resourceId: null,
          resource: null,
          position: [0, 0],
          orientation: 0
        };
      },
      render: function(drawFunctions, display, renderData, renderables) {
        var context, drawRenderable, height, renderable, resource, type, width, _i, _len, _results;
        context = display.context;
        width = display.size[0];
        height = display.size[1];
        context.clearRect(-width / 2, -height / 2, width, height);
        _results = [];
        for (_i = 0, _len = renderables.length; _i < _len; _i++) {
          renderable = renderables[_i];
          context.save();
          type = renderable.type;
          resource = renderable.resource != null ? renderable.resource : renderData[type][renderable.resourceId];
          if (resource == null) {
            throw "Resource " + renderable.resourceId + " does not exist.";
          }
          drawRenderable = drawFunctions[type];
          drawRenderable(renderable, context, resource);
          _results.push(context.restore());
        }
        return _results;
      }
    };
  });

  define("MainLoop", [], function() {
    var defaultCallNextFrame, maxPassedTimeInMs, module;
    maxPassedTimeInMs = 1000 / 30;
    defaultCallNextFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(f) {
      return window.setTimeout(f, 1000 / 60, Date.now());
    };
    return module = {
      execute: function(f, callNextFrame) {
        var mainLoop, previousTimeInMs;
        callNextFrame = callNextFrame || defaultCallNextFrame;
        previousTimeInMs = null;
        mainLoop = function(currentTimeInMs) {
          var currentTimeInS, passedTimeInMs, passedTimeInS;
          passedTimeInMs = currentTimeInMs - previousTimeInMs;
          previousTimeInMs = currentTimeInMs;
          passedTimeInMs = Math.min(passedTimeInMs, maxPassedTimeInMs);
          currentTimeInS = currentTimeInMs / 1000;
          passedTimeInS = passedTimeInMs / 1000;
          f(currentTimeInS, passedTimeInS);
          return callNextFrame(mainLoop);
        };
        return callNextFrame(mainLoop);
      }
    };
  });

  define("Input", [], function() {
    var ensureKeyNameIsValid, keyCode, keyCodesByName, keyName, keyNameArrayToKeyCodeSet, keyNamesByCode, module;
    keyNamesByCode = {
      8: "backspace",
      9: "tab",
      13: "enter",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "caps lock",
      27: "escape",
      32: "space",
      33: "page up",
      34: "page down",
      35: "end",
      36: "home",
      37: "left arrow",
      38: "up arrow",
      39: "right arrow",
      40: "down arrow",
      45: "insert",
      46: "delete",
      48: "0",
      49: "1",
      50: "2",
      51: "3",
      52: "4",
      53: "5",
      54: "6",
      55: "7",
      56: "8",
      57: "9",
      65: "a",
      66: "b",
      67: "c",
      68: "d",
      69: "e",
      70: "f",
      71: "g",
      72: "h",
      73: "i",
      74: "j",
      75: "k",
      76: "l",
      77: "m",
      78: "n",
      79: "o",
      80: "p",
      81: "q",
      82: "r",
      83: "s",
      84: "t",
      85: "u",
      86: "v",
      87: "w",
      88: "x",
      89: "y",
      90: "z",
      91: "left window key",
      92: "right window key",
      93: "select key",
      96: "numpad 0",
      97: "numpad 1",
      98: "numpad 2",
      99: "numpad 3",
      100: "numpad 4",
      101: "numpad 5",
      102: "numpad 6",
      103: "numpad 7",
      104: "numpad 8",
      105: "numpad 9",
      106: "multiply",
      107: "add",
      109: "subtract",
      110: "decimal point",
      111: "divide",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "num lock",
      145: "scroll lock",
      186: "semi-colon",
      187: "equal sign",
      188: "comma",
      189: "dash",
      190: "period",
      191: "forward slash",
      192: "grave accent",
      219: "open bracket",
      220: "back slash",
      221: "close braket",
      222: "single quote"
    };
    keyCodesByName = {};
    for (keyCode in keyNamesByCode) {
      keyName = keyNamesByCode[keyCode];
      keyCodesByName[keyName] = parseInt(keyCode);
    }
    ensureKeyNameIsValid = function(keyName) {
      if (keyCodesByName[keyName] == null) {
        throw "\"" + keyName + "\" is not a valid key name.";
      }
    };
    keyNameArrayToKeyCodeSet = function(keyNameArray) {
      var keyCodeSet, keyName, _i, _len;
      keyCodeSet = {};
      for (_i = 0, _len = keyNameArray.length; _i < _len; _i++) {
        keyName = keyNameArray[_i];
        keyCode = keyCodesByName[keyName];
        keyCodeSet[keyCode] = true;
      }
      return keyCodeSet;
    };
    return module = {
      keyNamesByCode: keyNamesByCode,
      keyCodesByName: keyCodesByName,
      preventDefaultFor: function(keyNames) {
        var keyCodeSet;
        keyCodeSet = keyNameArrayToKeyCodeSet(keyNames);
        return window.addEventListener("keydown", function(keyDownEvent) {
          if (keyCodeSet[keyDownEvent.keyCode]) {
            return keyDownEvent.preventDefault();
          }
        });
      },
      createCurrentInput: function() {
        var currentInput;
        currentInput = {};
        window.addEventListener("keydown", function(keyDownEvent) {
          keyName = keyNamesByCode[keyDownEvent.keyCode];
          return currentInput[keyName] = true;
        });
        window.addEventListener("keyup", function(keyUpEvent) {
          keyName = keyNamesByCode[keyUpEvent.keyCode];
          return currentInput[keyName] = false;
        });
        return currentInput;
      },
      onKeys: function(keyNames, callback) {
        var keysOfInterest;
        keysOfInterest = keyNameArrayToKeyCodeSet(keyNames);
        return window.addEventListener("keydown", function(keyDownEvent) {
          if (keysOfInterest[keyDownEvent.keyCode]) {
            keyName = keyNamesByCode[keyDownEvent.keyCode];
            return callback(keyName, keyDownEvent);
          }
        });
      },
      isKeyDown: function(currentInput, keyName) {
        ensureKeyNameIsValid(keyName);
        return currentInput[keyName] === true;
      }
    };
  });

  define("Vec2", [], function() {
    var module;
    return module = {
      copy: function(v) {
        return [v[0], v[1]];
      },
      scale: function(v, s) {
        v[0] *= s;
        return v[1] *= s;
      },
      add: function(v1, v2) {
        v1[0] += v2[0];
        return v1[1] += v2[1];
      },
      subtract: function(v1, v2) {
        v1[0] -= v2[0];
        return v1[1] -= v2[1];
      },
      dot: function(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
      },
      length: function(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
      },
      squaredLength: function(v) {
        return v[0] * v[0] + v[1] * v[1];
      },
      unit: function(v) {
        var length;
        length = module.length(v);
        v[0] /= length;
        return v[1] /= length;
      },
      applyTransform: function(v, t) {
        var x, y;
        x = v[0], y = v[1];
        v[0] = x * t[0][0] + y * t[0][1] + 1 * t[0][2];
        return v[1] = x * t[1][0] + y * t[1][1] + 1 * t[1][2];
      }
    };
  });

  define("Camera", ["Mat3x3", "Vec2", "Transform2d"], function(Mat3x3, Vec2, Transform2d) {
    var module;
    return module = {
      createCamera: function() {
        var camera;
        return camera = {
          position: [0, 0],
          rotation: 0,
          zoomFactor: 1
        };
      },
      transformRenderables: function(camera, renderables) {
        var offset, r, renderable, s, t, transform, _i, _len, _results;
        offset = Vec2.copy(camera.position);
        Vec2.scale(offset, -1);
        transform = Transform2d.identityMatrix();
        t = Transform2d.translationMatrix(offset);
        r = Transform2d.rotationMatrix(camera.rotation);
        s = Transform2d.scalingMatrix(camera.zoomFactor);
        Mat3x3.multiply(transform, s);
        Mat3x3.multiply(transform, r);
        Mat3x3.multiply(transform, t);
        _results = [];
        for (_i = 0, _len = renderables.length; _i < _len; _i++) {
          renderable = renderables[_i];
          _results.push(Vec2.applyTransform(renderable.position, transform));
        }
        return _results;
      }
    };
  });

  define("Mat3x3", [], function() {
    var module;
    return module = {
      multiply: function(m1, m2) {
        var m00, m01, m02, m10, m11, m12, m20, m21, m22;
        m00 = m1[0][0];
        m01 = m1[0][1];
        m02 = m1[0][2];
        m10 = m1[1][0];
        m11 = m1[1][1];
        m12 = m1[1][2];
        m20 = m1[2][0];
        m21 = m1[2][1];
        m22 = m1[2][2];
        m1[0][0] = m00 * m2[0][0] + m01 * m2[1][0] + m02 * m2[2][0];
        m1[0][1] = m00 * m2[0][1] + m01 * m2[1][1] + m02 * m2[2][1];
        m1[0][2] = m00 * m2[0][2] + m01 * m2[1][2] + m02 * m2[2][2];
        m1[1][0] = m10 * m2[0][0] + m11 * m2[1][0] + m12 * m2[2][0];
        m1[1][1] = m10 * m2[0][1] + m11 * m2[1][1] + m12 * m2[2][1];
        m1[1][2] = m10 * m2[0][2] + m11 * m2[1][2] + m12 * m2[2][2];
        m1[2][0] = m20 * m2[0][0] + m21 * m2[1][0] + m22 * m2[2][0];
        m1[2][1] = m20 * m2[0][1] + m21 * m2[1][1] + m22 * m2[2][1];
        return m1[2][2] = m20 * m2[0][2] + m21 * m2[1][2] + m22 * m2[2][2];
      }
    };
  });

  define("MyModule", [], function() {
    var module;
    return module = {
      itIsAwesome: true
    };
  });

  define("Logic", ["Input", "Entities"], function(Input, Entities) {
    var createEntity, destroyEntity, entityFactories, module, nextEntityId;
    nextEntityId = 0;
    entityFactories = {
      "myEntity": function(args) {
        var entity, id, movement;
        movement = {
          center: args.center,
          radius: args.radius,
          speed: args.speed
        };
        id = nextEntityId;
        nextEntityId += 1;
        return entity = {
          id: id,
          components: {
            "positions": [0, 0],
            "movements": movement,
            "imageIds": "images/star.png"
          }
        };
      }
    };
    createEntity = null;
    destroyEntity = null;
    return module = {
      createGameState: function() {
        var gameState;
        return gameState = {
          focus: [0, 0],
          components: {}
        };
      },
      initGameState: function(gameState) {
        createEntity = function(type, args) {
          return Entities.createEntity(entityFactories, gameState.components, type, args);
        };
        destroyEntity = function(entityId) {
          return Entities.destroyEntity(gameState.components, entityId);
        };
        createEntity("myEntity", {
          center: [0, 0],
          radius: 50,
          speed: 2
        });
        return createEntity("myEntity", {
          center: [0, 0],
          radius: 100,
          speed: -1
        });
      },
      updateGameState: function(gameState, currentInput, timeInS, passedTimeInS) {
        var angle, entityId, movement, position, _ref, _results;
        _ref = gameState.components.positions;
        _results = [];
        for (entityId in _ref) {
          position = _ref[entityId];
          movement = gameState.components.movements[entityId];
          angle = timeInS * movement.speed;
          position[0] = movement.radius * Math.cos(angle);
          _results.push(position[1] = movement.radius * Math.sin(angle));
        }
        return _results;
      }
    };
  });

  define("Game", ["Images", "Rendering", "Input", "MainLoop", "Logic", "Graphics"], function(Images, Rendering, Input, MainLoop, Logic, Graphics) {
    return Images.loadImages(["images/star.png"], function(rawImages) {
      var currentInput, display, gameState, images, renderData, renderState;
      images = Images.process(rawImages);
      renderData = {
        "image": images
      };
      Input.preventDefaultFor(["up arrow", "down arrow", "left arrow", "right arrow", "space"]);
      display = Rendering.createDisplay();
      currentInput = Input.createCurrentInput();
      gameState = Logic.createGameState();
      renderState = Graphics.createRenderState();
      Logic.initGameState(gameState);
      return MainLoop.execute(function(currentTimeInS, passedTimeInS) {
        Logic.updateGameState(gameState, currentInput, currentTimeInS, passedTimeInS);
        Graphics.updateRenderState(renderState, gameState);
        return Rendering.render(Rendering.drawFunctions, display, renderData, renderState.renderables);
      });
    });
  });

  define("Graphics", ["Rendering", "Camera", "Vec2"], function(Rendering, Camera, Vec2) {
    var module;
    return module = {
      createRenderState: function() {
        var renderState;
        return renderState = {
          camera: Camera.createCamera(),
          renderables: []
        };
      },
      updateRenderState: function(renderState, gameState) {
        var entityId, imageId, position, renderable, _ref;
        renderState.camera.position = Vec2.copy(gameState.focus);
        renderState.renderables.length = 0;
        _ref = gameState.components.positions;
        for (entityId in _ref) {
          position = _ref[entityId];
          imageId = gameState.components.imageIds[entityId];
          renderable = Rendering.createRenderable("image");
          renderable.resourceId = imageId;
          renderable.position = Vec2.copy(position);
          renderState.renderables.push(renderable);
        }
        return Camera.transformRenderables(renderState.camera, renderState.renderables);
      }
    };
  });

}).call(this);
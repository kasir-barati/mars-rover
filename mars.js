// @ts-check
const { match } = require("assert/strict");
/**
 *
 * @param {string} instructions
 * instructions
 * - 5 5 is the upper-right coordinates
 * - L and R makes the rover spin 90 degrees left or right respectively
 * - 1 1 N is Rover’s position; a combination of x and y coordinates and a its cardinal compass point.
 * - Each rover has two lines of input.
 * - Each rover will be finished sequentially
 * - Lower-left coordinates are assumed to be 0,0
 * @example
 * 5 5
 * 1 1 N
 * LMLMLMLMM
 * 3 3 E
 * MMRMMRMRRM
 *
 * @returns {string}
 * Final coordinates and heading of each rover.
 */
module.exports.marsRover = (instructions) => {
  // Throw error if rover got out of the plateau
  // I'm not sure how but I'll come back to it later.
  // split by endline.
  const instructionsArray = genInstruction(instructions);
  const [upperRightCoordinates, ...unProcessedRoversInstructions] =
    instructionsArray;
  // Create rovers and their control
  const roversInstructions = genRoversInstructions(
    unProcessedRoversInstructions
  );
  // start from the first one and calculate its position to the end
  for (const roverInstruction of roversInstructions) {
    roverInstruction.position = calcRoverPosition(roverInstruction);
  }

  return roversInstructions.reduce(
    (accumulator, current) => (accumulator += current.position + "\n"),
    ""
  );
};

/**
 *
 * @param {string} instructions
 * @returns {string[]}
 */
function genInstruction(instructions) {
  return instructions.split("\n").filter((i) => i.length > 0);
}

/**
 *
 * @param {RoverInstruction} roverInstruction
 * @returns {string}
 */
function calcRoverPosition(roverInstruction) {
  const controlInstructions = roverInstruction.controlInstructions.split("");
  let [xPosition, yPosition, cardinalCompassHeading] =
    roverInstruction.position.split(" ");
  let x = Number(xPosition);
  let y = Number(yPosition);

  for (const control of controlInstructions) {
    match(control, /L|R|M/, "Bad control instruction received");

    switch (control) {
      case "L":
      case "R":
        cardinalCompassHeading = calcNewCardinalCompassHeading(
          cardinalCompassHeading,
          control
        );
        break;
      case "M":
        cardinalCompassHeading === "E" && x++;
        cardinalCompassHeading === "W" && x--;
        cardinalCompassHeading === "N" && y++;
        cardinalCompassHeading === "s" && y--;
        break;
    }
  }

  return `${x} ${y} ${cardinalCompassHeading}`;
}

/**
 *
 * @param {string} currentCardinalCompassHeading
 * @param {"L" | "R"} turnTo
 * @returns {"E"| "N" | "S" | "W"}
 */
function calcNewCardinalCompassHeading(currentCardinalCompassHeading, turnTo) {
  match(turnTo, /L|R/, "Bad control instruction - turnTo");
  match(currentCardinalCompassHeading, /E|W|N|S/, "Bad cardinal compass point");

  switch (currentCardinalCompassHeading) {
    case "E":
      if (turnTo === "L") {
        return "N";
      }
      if (turnTo === "R") {
        return "S";
      }
      break;
    case "W":
      if (turnTo === "L") {
        return "S";
      }
      if (turnTo === "R") {
        return "N";
      }
      break;
    case "N":
      if (turnTo === "L") {
        return "W";
      }
      if (turnTo === "R") {
        return "E";
      }
      break;
    case "S":
      if (turnTo === "L") {
        return "E";
      }
      if (turnTo === "R") {
        return "W";
      }
      break;
  }
}

/**
 *
 * @param {string[]} unProcessedInstructions
 * @returns {RoverInstruction[]}
 */
function genRoversInstructions(unProcessedInstructions) {
  /**@type {RoverInstruction[]} */
  const roversInstructions = [];

  for (let index = 0; index < unProcessedInstructions.length; index += 2) {
    roversInstructions.push({
      position: unProcessedInstructions[index],
      controlInstructions: unProcessedInstructions[index + 1],
    });
  }

  return roversInstructions;
}

/**
 * @typedef RoverInstruction
 * @property {string} position
 * @property {string} controlInstructions
 */

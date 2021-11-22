let leftTaxi = false;

const gameNodes = {
  // ======
  // Schema
  // ======
  exampleLabel: {
    // Minimum.
    text: "This is an example node schema",
    choices: [
      {
        // Minimum.
        next: "Some node name",
        // More fields.
        text: "Choice description",
        item: "some item name",
        newItems: ["some item name"],
      },
    ],
    // More fields.
    tip: "some explanatory tip",
    gainedItems: ["some item name"],
  },
  // ====
  // Game
  // ====
  start: {
    text: `<b>It's raining.</b> It's always been raining. You notice the bus slowing down. "Wake up," you say to the stranger next to you. "We're almost in Toyota Town." He doesn't wake up.`,
    tip: "choiceClick",
    choices: [
      {
        text: "Keep trying to wake up the stranger",
        next: "keepWaking",
      },
      {
        text: "Steal his shark-tooth necklace",
        next: "takeSharktooth",
        newItems: ["shark-tooth necklace"],
      },
      {
        text: "Let him be",
        next: "letStrangerBe",
      }
    ],
  },
  keepWaking: {
    text: `<b>The stranger grumbles.</b> He's alive. "Good," you think. "Another dead body is the last thing I need right now." You puff out your chest, having done your first -- and last -- good deed for the day. You notice a gerbil dancing on the man's head.`,
    choices: [
      {
        text: "Steal his gerbil",
        next: "stealGerbil",
      },
      {
        text: "Slither on off the bus",
        next: "offBus",
      },
    ],
  },
  takeSharktooth: {
    text: `That <i>sharktooth-necklace</i> looks mighty tempting to your hungry eyes. <b>You pocket it adroitly</b> before heading off the bus. It might serve as a tasty snack later.`,
    choices: [
      {
        text: "Exit the bus with a slightly guilty conscience",
        next: "offBus",
      },
    ],
    gainedItems: ["sharktooth-necklace"],
  },
  letStrangerBe: {
    text: `You decide to perform your good deed for the day and not rob the stranger. <b>Your heart swells up from doing good.</b> While you're at it, you leave him some <i>pickled quail eggs</i>, a delicacy in your home country. He may have missed his stop, but at least he won't go hungry. You're feeling good -- it pays to be kind.`,
    choices: [
      {
        text: "Leave the bus",
        next: "offBus",
      }
    ],
    lostItems: ["pickled quail eggs"],
  },
  stealGerbil: {
    text: `You recall your past life as a gerbil charmer. You take out a rustic Native American flute and began to play "Despacito". <b>The gerbil, mesmerized, walks right into your fanny pack.</b> It might serve as a tasty snack later.`,
    tip: "itemHighlight",
    choices: [
      {
        text: "Leave the bus with your new best friend",
        next: "offBus",
      },
      {
        item: "dancing gerbil",
        next: "releaseGerbil",
      },
    ],
    gainedItems: ["dancing gerbil"],
  },
  releaseGerbil: {
    text: `It's hard, but you know you have to do it. <b>Gerbils and people can never get along.</b> You chuck the little critter out the window with a solitary tear in your eye.`,
    choices: [
      {
        text: "Take your lonesome self off the bus",
        next: "offBus",
      },
    ],
  },
  offBus: {
    text: `<b>You make your way off the bus</b>, glad to be off. You couldn't stand breathing in the foul bus air. That was probably your fault, but it doesn't matter. You are now in the foul air of Toyota Town. You never thought you'd see this place again, but here you are. You need to get to Toyota Tower.`,
    choices: [
      {
        text: "Stumble into the nearest umarked van",
        next: "nearestVan",
      },
      {
        text: "Hail taxi",
        next: "hailTaxi"
      },
    ],
  },
  nearestVan: {
    text: `<b>You jump headfirst into a nearby unmarked van.</b> It was definitely risky, but you're in luck -- it's a gnome-mobile. You learned some gnomish in college. "Ba da ba?" They laugh. You're in. The gnomes treat you to a nourishing dish of refried grass before leaving you with a pot of gold and foot fungus. You leave the gnome-mobile. A taxi pulls up.`,
    choices: [
      {
        text: "Enter the taxi gingerly",
        next: "enterTaxiGingerly",
      },
      {
        text: "Enter the taxi belligerently",
        next: "enterTaxiBelligerently",
      },
    ],
    gainedItems: ["pot of gold"],
  },
  hailTaxi: {
    text: `<b>You hail King Taxi.</b> There are people watching you. There is tension in the air. Finally, the crowd joins in. "Hail King Taxi!" You hear a loud chorus swell up as the hailing spreads to all of Toyota Town, and the surrounding province of Lexus. A taxi pulls up.`,
    choices: [
      {
        text: "Enter the taxi gingerly",
        next: "enterTaxiGingerly",
      },
      {
        text: "Enter the taxi belligerently",
        next: "enterTaxiBelligerently",
      },
    ],
  },
  enterTaxiGingerly: {
    text: `<b>You carefully enter the taxi</b>, taking pains to not upset the upholstery. "Where to," comes a grunt from the driver. "The Tower." "Toyota Tower?" An uneasy silence. "You're crazy. I can't take you there."`,
    tip: "itemHighlight",
    choices: [
      {
        text: "Leave taxi, disappointed and anxious",
        next: "leaveTaxi",
        if: () => !leftTaxi,
      },
      {
        item: "pickled quail eggs",
        next: "pqeBribe",
      },
      {
        item: "wad of blue slime",
        next: "wobsBribe",
      }
    ],
  },
  enterTaxiBelligerently: {
    text: `<b>You enter the taxi as if you own the place</b>. You smirk at the driver as you put your seatbelt on. "Where to," comes a grunt from the driver." "The Tower, old man." "Toyota Tower?" An uncomfortable silence. "You're out of your mind. I can't take you there."`,
    tip: "itemHighlight",
    choices: [
      {
        text: "Leave taxi with a huff",
        next: "leaveTaxi",
        if: () => !leftTaxi,
      },
      {
        item: "pickled quail eggs",
        next: "pqeBribe",
      },
      {
        item: "wad of blue slime",
        next: "wobsBribe",
      }
    ],
  },
  leaveTaxi: {
    text: `<b>You step out of the taxi.</b> "Now what," you mutter. "There's only one taxi in Toyota Town." You scarcely finish muttering when you notice a quivering <i>wad of blue slime</i>. You pick it up. It feels warm to the touch. "Perfect," you say as you turn back towards the taxi. "Now I have something to bargain with."`,
    choices: [
      {
        text: "Enter the taxi gingerly",
        next: "enterTaxiGingerly",
      },
      {
        text: "Enter the taxi belligerently",
        next: "enterTaxiBelligerently",
      },
    ],
    gainedItems: ["wad of blue slime"],
    code: () => leftTaxi = true,
  },
  pqeBribe: {
    text: `<b>You open the pickled quail eggs</b>, temptingly wafting them in the musty taxicab air. "Eh? Is this a bribe, sirs?" You raise an eyebrow, while lowering the other one. "You know what it is." The driver thinks for a long time, then falls asleep.`,
    choices: [
      {
        text: "Take a nap, too",
        next: "flamencoNap",
      },
    ],
  },
  wobsBribe: {
    text: `<b>You take out the wad of blue slime</b>, temptingly waving it under the driver's mustachio'd nose. "Eh? Is this a bribe, sirs?" You wink, then sneeze. "You know what it is." The driver thinks for a long time, then falls asleep.`,
    choices: [
      {
        text: "Take a nap, too",
        next: "flamencoNap",
      }
    ],
  },
  flamencoNap: {
    text: `You take the opportunity to take a <b>nice, long nap</b>. Not for the first time, you dream of angry flamenco dancers. "I didn't mean to!" you yell as they come straight for you. You wake up to the intimidating edifice of Toyota Tower. You step out of the taxi. "Thanks for getting me here, old man." The driver bows, a feeble "Toyota" escaping his lips.`,
    choices: [], // TODO
    gainedItems: ["old balogna sandwich"],
  },
};
let gameNode = gameNodes["start"];
const tips = {
  choiceClick: {
    text: "Click on one of the choices below to continue your adventure.",
  },
  itemHighlight: {
    text: "Items in your inventory are highlighted when they are usable.",
  }
};

const inventory = [
  "pickled quail eggs",
];
// List of new items added in the previous choice. Cleared after every turn.
let newItems = [];

function handleChoice(choice) {
  // Clear all registered events.
  $("*").unbind();

  // Clear all new items.
  newItems = [];

  // Update inventory.

  // Update game node.
  gameNode = gameNodes[choice.next];
  if (gameNode.gainedItems) {
    inventory.push(...gameNode.gainedItems);
    newItems.push(...gameNode.gainedItems);
  }
  if (gameNode.lostItems) {
    gameNode.lostItems.map(item => {
      removeItem(item);
    });
  }
  if (gameNode.code) {
    gameNode.code();
  }

  // Display new game state.
  displayGame();
}

function displaySituation() {
  let text = gameNode.text;
  if (gameNode.tip) {
    const tip = tips[gameNode.tip];
    if (!tip.seen) {
      text += `<br><br><i>Tip: ${tip.text}</i>`;
      tip.seen = true;
    }
  }

  $("#situation-display").html(text);
}

function displayChoices() {
  let choices = "";

  // Add HTML.

  const classString = `class="game-choice"`;
  let i = 0;
  gameNode.choices.map(choice => {
    if (shouldDisplayChoice(choice)) {
      const idString = `id="choice${i}"`;
      choices += `<li ${classString} ${idString}>${choice.text}</li>`;

      i ++;
    }
  });

  $("#choices-display").html(`<ul>${choices}</ul>`);

  // Add click handlers.

  i = 0;
  gameNode.choices.map(choice => {
    if (shouldDisplayChoice(choice)) {
      $(`#choice${i}`).click(function() {
        handleChoice(choice);
      });

      i++
    }
  });
}

// Display all the items in the inventory.
function displayInventory() {
  let items = "";
  // Keeps track of choices for selectable items.
  const itemChoices = [];

  let i = 0;
  inventory.map(item => {
    // Add HTML.

    let classes = [];

    const new_item = newItems.includes(item);
    const selectable_item = gameNode.choices.some((choice) => {
      if (choice.item === item) {
        itemChoices.push([choice, i]);
        return true;
      }
      return false;
    });

    if (new_item) {
      item = `<b>${item}</b>`;
    }
    if (selectable_item) {
      classes.push("game-selectable-item");
    }

    const classString = `class="${classes.join(" ")}"`;
    const idString = `id="item${i}"`;
    items += `<li ${classString} ${idString}>${item}</li>`;

    i ++;
  });

  newItems = [];

  $("#inventory-display").html(`<ul>${items}</ul>`);

  // Add click handlers.

  itemChoices.map(([choice, i]) => {
    $(`#item${i}`).click(function() {
      // Remove item from inventory.
      removeItem(choice.item);
      // Run choice handler.
      handleChoice(choice);
    });
  });
}

function displayGame() {
  displaySituation();
  displayChoices();
  displayInventory();
}

displayGame();

function removeItem(item) {
  const index = inventory.indexOf(item);
  if (index > -1) {
    inventory.splice(index, 1);
  }
}

function shouldDisplayChoice(choice) {
  if (!choice.text) {
    return false;
  }
  if (choice.if && !choice.if()) {
    return false;
  }
  return true;
}

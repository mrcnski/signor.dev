/*
  This is an adventure game engine I made.

  Have the following variables defined in a separate script:
  - gameNodes: An object containing all the game nodes.
  - gameNode: A reference to the starting node.
  - inventory: An array containing the starting items.

  Have elements on your page with these IDs:
  - #situation-display
  - #choices-display
  - #inventory-display

  Have CSS rules for the following classes:
  - game-choice
  - game-selectable-item

  TODO: outdated
  Game node schema:
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
 */

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

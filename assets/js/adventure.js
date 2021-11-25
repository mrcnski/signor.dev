/*
  This is an adventure game engine I made.

  Have the following libraries loaded:
  - jquery

  Have the following variables defined in a separate script:
  - gameNodes: An object containing all the game nodes.
  - gameNode: A reference to the starting node.
  - inventory: An array containing the starting items.

  Have div elements on your page with these IDs:
  - #situation-display
  - #choices-display
  - #inventory-display

  Have CSS rules for the following classes:
  - .game-choice
  - .game-selectable-item

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

// ==========
// Game logic
// ==========

/**
 * Handle the given choice (i.e. run the game logic).
 */
function handleChoice(choice) {
  // Clear all registered events.
  $("*").unbind();

  // Clear the list of new items.
  newItems = [];

  // Update game node.
  gameNode = gameNodes[choice.next];

  // Update inventory.
  if (gameNode.gainedItems) {
    inventory.push(...gameNode.gainedItems);
    newItems.push(...gameNode.gainedItems);
  }
  if (gameNode.lostItems) {
    gameNode.lostItems.map(item => {
      removeItem(item);
    });
  }

  // Run node code.
  if (gameNode.code) {
    gameNode.code();
  }

  // Display new game state.
  displayGame();
}

// ============
// Display code
// ============

/**
 * Displays the situation text for the current game node.
 */
function displaySituation() {
  let text = gameNode.text;

  // Add the tip if the node has one.
  if (gameNode.tip) {
    // Get the tip from the tips object.
    const tip = tips[gameNode.tip];

    // Only show the tip if it hasn't been seen before.
    if (!tip.seen) {
      text += `<br><br><i>Tip: ${tip.text}</i>`;
      tip.seen = true;
    }
  }

  $("#situation-display").html(text);
}

/**
 * Displays all choices currently available to the player and registers click
 * handlers.
 */
function displayChoices() {
  // Add HTML.

  const $choices = $("<ul>");

  // Add all the displayable choices to the #choices-display div.
  let i = 0;
  gameNode.choices.map(choice => {
    if (shouldDisplayChoice(choice)) {
      const $choice = $("<li>").addClass("game-choice").attr("id",  `choice${i}`).text(choice.text);
      $choices.append($choice);

      i ++;
    }
  });

  $("#choices-display").empty().append($choices);

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

/**
 * Display all the items in the inventory and registers click handlers for any
 * selectable items.
 */
function displayInventory() {
  // Keeps track of choices for selectable items.
  const itemChoices = [];

  // Add HTML.

  const $items = $("<ul>");

  let i = 0;
  inventory.map(item => {
    let classes = [];

    const is_new_item = newItems.includes(item);
    const is_selectable_item = gameNode.choices.some((choice) => {
      if (choice.item === item) {
        itemChoices.push([choice, i]);
        return true;
      }
      return false;
    });

    const $item = $("<li>");
    if (is_new_item) {
      $item.css("font-weight","Bold");
    }
    if (is_selectable_item) {
      $item.addClass("game-selectable-item");
    }

    $item.attr("id", `item${i}`).text(item);
    $items.append($item);

    i ++;
  });

  $("#inventory-display").empty().append($items);

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

/**
 * Displays the entire game.
 */
function displayGame() {
  displaySituation();
  displayChoices();
  displayInventory();
}

// =======
// Helpers
// =======

/**
 * Removes the given item from the inventory.
 */
function removeItem(item) {
  const index = inventory.indexOf(item);
  if (index > -1) {
    inventory.splice(index, 1);
  }
}

/**
 * Should the choice be displayed?
 */
function shouldDisplayChoice(choice) {
  // If the choice has no text (i.e. it is a selectable item), don't display it.
  if (!choice.text) {
    return false;
  }
  // Check choice conditional.
  if (choice.if && !choice.if()) {
    return false;
  }
  return true;
}

// ==========
// Start game
// ==========

displayGame();

let Head: number[];
let Tail: number[];
//  import the python libraries we need
//  Initialize the variables we'll be using
//  Body will track each segment (x,y) of the snake
let Body = [[2, 4]]
//  FoodLocation will be the (x,y) of the food
//  Start with the same location as our snake,
//  then we'll use the GetNewFoodLocation function to pick a new random spot
let FoodLocation = [2, 4]
//  The four directions, expressed in (x,y)
//  up, right, down, left
let Directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]
//  The current direction of the snake (index to the Directions list)
//  0 = up, 1 = right, 2 = down, 3 = left
let CurDir = 0
//  Keep track of which button was pressed
let ButtonPressed = "None"
//  Turn on the LED of our first snake segment
led.plot(Body[0][0], Body[0][1])
//  Define a function to randomly pick a new food location
//  Make sure we pick a spot that isn't already occupied by the snake
function GetNewFoodLocation(FoodLocation: number[]): number[] {
    //  Check if the LED is turned on at the location we picked
    //  If it is, keep picking a new random spot until we find a good one
    while (led.point(FoodLocation[0], FoodLocation[1])) {
        //  This will pick a random (x) and (y) from 0-4 to match our microbit screen
        FoodLocation = [randint(0, 4), randint(0, 4)]
    }
    //  Turn on the LED at the new food location, but keep it dimmer to tell it apart
    //  from the snake
    led.plotBrightness(FoodLocation[0], FoodLocation[1], 10)
    return FoodLocation
}

//  When the snake crashes, display the game over animation and the current score
//  The score will be the number of snake segments * 10
function GameOver(Score: number) {
    let i: number;
    let j: number;
    //  Turn on each LED with a slight pause in between
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            led.plot(i, j)
            pause(50)
        }
    }
    //  0.05 seconds
    //  Now show the skull because the snake died :(
    basic.showIcon(IconNames.Skull)
    pause(1000)
    //  1 second
    //  Now turn off the LEDs with a quicker pause in between
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            led.unplot(i, j)
            pause(25)
        }
    }
    //  And finally, display the score forever
    //  until the microbit gets reset to start a new game
    while (true) {
        basic.showString("" + Score * 10)
    }
}

//  Input handlers for our two buttons
//  This function will get called automatically when button A is pressed
//  Mark that button A was pressed
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    //  global means this variable can be accessed from anywhere
    ButtonPressed = "A"
})
//  This function will get called automatically when button B is pressed
//  Mark that button B was pressed
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    ButtonPressed = "B"
})
//  Call the GetNewFoodLocation function to get our initial food location
FoodLocation = GetNewFoodLocation(FoodLocation)
//  Execute the main game loop until the snake crashes
while (true) {
    //  Check if one of our buttons was pressed
    //  The A button will turn the snake to the left
    //  The B button will turn the snake to the right
    //  We can do this by indexing through our Directions list
    //  Pressing A will move the index from 0 -> 3 -> 2 -> 1 -> 0
    if (ButtonPressed == "A") {
        if (CurDir > 0) {
            CurDir -= 1
        } else {
            CurDir = 3
        }
        
    } else if (ButtonPressed == "B") {
        //  Pressing B will move the index from 0 -> 1 -> 2 -> 3 -> 0
        //  This is a modulo (%) operator, which gives the remainder portion of a division
        //  In this case, once CurDir hits 4, it will be reset to 0
        CurDir = (CurDir + 1) % 4
    }
    
    //  Reset our button tracker to wait for a new button pressed
    ButtonPressed = "None"
    //  Create a new head for the snake by taking the current head segment and applying our Direction to it
    Head = [Body[0][0] + Directions[CurDir][0], Body[0][1] + Directions[CurDir][1]]
    //  Check if the snake crashed by seeing if the new head segment is either out of bounds (x or y less than 0 or greater than 4)
    //  Or if we ran into another snake segment (LED turned on but not the FoodLocation)
    if (Head[0] < 0 || Head[1] < 0 || Head[0] > 4 || Head[1] > 4 || led.point(Head[0], Head[1]) && !(Head[0] == FoodLocation[0] && Head[1] == FoodLocation[1])) {
        //  The snake crashed!  Let's show the score (how many snake segments were collected)
        GameOver(Body.length - 1)
    }
    
    //  len() returns the total number of entries within Body[].  Subtract 1 because we started with 1 segment
    //  If the snake didn't crash, turn on the LED at the new Head location    
    led.plot(Head[0], Head[1])
    //  Add the new head location to our snake segment list at position 0 (the head)
    Body.insertAt(0, Head)
    //  Now lets check if the snake ate some food
    if (Head[0] == FoodLocation[0] && Head[1] == FoodLocation[1]) {
        //  If it did, create a new food somewhere random
        FoodLocation = GetNewFoodLocation(FoodLocation)
    } else {
        //  If it didn't eat any food, then turn off the LED at the tail of the snake
        //  Since we only want the snake to grow if it ate food
        //  The Tail of the snake will be indexed at the total length of the snake (len(Body))
        //  minus 2, because python lists start at 0
        Tail = Body[Body.length - 1]
        //  Turn off the LED at the Tail
        led.unplot(Tail[0], Tail[1])
        //  Now remove the Tail from the Body segments
        //  pop() will pop the last item off of the Body list (which will be the Tail)
        _py.py_array_pop(Body)
    }
    
    //  Pause the game for a second (1000 ms) to give the player some time to react!
    //  Otherwise the snake will run right into a wall before we even know what happened
    pause(1000)
}

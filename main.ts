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
//  Keep track of our secret Logo press
let LogoPressed = false
//  Turn on the LED of our first snake segment
led.plotBrightness(Body[0][0], Body[0][1], 128)
//  Which level are we on?
let Level = 1
//  The gamespeed (lower is faster)
let GameSpeed = 1000
//  Define a function to randomly pick a new food location
//  Make sure we pick a spot that isn't already occupied by the snake
function GetNewFoodLocation() {
    
    //  global means we can access this variable from anywhere
    //  Check if the LED is turned on at the location we picked
    //  If it is, keep picking a new random spot until we find a good one
    while (led.point(FoodLocation[0], FoodLocation[1])) {
        //  This will pick a random (x) and (y) from 0-4 to match our microbit screen
        FoodLocation = [randint(0, 4), randint(0, 4)]
    }
    //  Turn on the LED at the new food location, but keep it dimmer to tell it apart
    //  from the snake
    led.plotBrightness(FoodLocation[0], FoodLocation[1], 10)
}

//  When the snake crashes, display the game over animation and the current score
//  The score will be the number of food eaten * 10
function GameOver(Score: number, Level: number) {
    let x: number;
    let y: number;
    //  Turn on each LED with a slight pause in between
    for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
            if (!led.point(x, y) || FoodLocation[0] == x && FoodLocation[1] == y || Body[0][0] == x && Body[0][1] == y) {
                led.plot(x, y)
                pause(75)
            }
            
        }
    }
    //  0.075 seconds
    pause(200)
    //  Now show the skull because the snake died :(
    basic.showIcon(IconNames.Skull)
    pause(1000)
    //  1 second
    //  Now turn off the LEDs with a quicker pause in between
    for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
            led.unplot(x, y)
            pause(25)
        }
    }
    //  And finally, display the score forever
    //  until the microbit gets reset to start a new game
    while (true) {
        basic.showString("" + (Score * 10 + Level * 100))
    }
}

//  Create Level 2
function StartLevel2() {
    let x: number;
    //  Reset the snake
    
    Body = [[2, 4]]
    
    CurDir = 0
    
    Level = 2
    
    ButtonPressed = "None"
    
    GameSpeed = 750
    
    LogoPressed = false
    //  Trophy
    basic.showIcon(IconNames.Happy)
    pause(2000)
    //  Reset the screen
    for (x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            led.unplot(x, y)
        }
    }
    //  Create some random obstacles
    for (x = 0; x < 3; x++) {
        led.plotBrightness(randint(0, 4), randint(0, 4), 200)
    }
    //  Make sure the spot in front of the snake is clear
    led.unplot(2, 3)
    led.plotBrightness(Body[0][0], Body[0][1], 128)
    //  Wait for a button press
    while (ButtonPressed == "None") {
        pause(100)
    }
    ButtonPressed = "None"
}

//  Create Level 3
function StartLevel3() {
    
    
    StartLevel2()
    //  Make sure the spot in front of the snake is clear
    GameSpeed = 650
    Level = 3
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
//  This function will get called automatically when the logo is pressed
input.onLogoEvent(TouchButtonEvent.Pressed, function on_logo_event_pressed() {
    
    LogoPressed = true
    led.plot(0, 0)
})
//  Call the GetNewFoodLocation function to get our initial food location
GetNewFoodLocation()
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
    //  The Tail of the snake will be indexed at the total length of the snake (len(Body))
    //  minus 1, because python lists start at 0
    Tail = Body[Body.length - 1]
    //  For Levels 2 and 3, wrap the snake around to the other side of the screen
    if (Level > 1) {
        Head[0] %= 5
        //  modulo operator wraps around from 4 -> 0
        Head[1] %= 5
        if (Head[0] < 0) {
            //  If the snake x,y is negative, wrap around back to 4
            Head[0] = 4
        }
        
        if (Head[1] < 0) {
            Head[1] = 4
        }
        
    }
    
    //  Check if the snake crashed by seeing if the new head segment is either out of bounds (x or y less than 0 or greater than 4)
    //  Or if we ran into another snake segment (LED turned on but not the FoodLocation or Tail of the snake)
    if (Head[0] < 0 || Head[1] < 0 || Head[0] > 4 || Head[1] > 4 || led.point(Head[0], Head[1]) && !(Head[0] == FoodLocation[0] && Head[1] == FoodLocation[1]) && !(Head[0] == Tail[0] && Head[1] == Tail[1])) {
        //  The snake crashed!  Let's show the score (how many snake segments were collected)
        GameOver(Body.length - 1, Level)
    }
    
    //  len() returns the total number of entries within Body[].  Subtract 1 because we started with 1 segment
    //  If the snake didn't crash, turn on the LED at the new Head location    
    led.plotBrightness(Head[0], Head[1], 128)
    //  Turn up the brightness on the old Head location to match the rest of the snake
    led.plot(Body[0][0], Body[0][1])
    //  Add the new head location to our snake segment list at position 0 (the head)
    Body.insertAt(0, Head)
    //  Now lets check if the snake ate some food
    if (Head[0] == FoodLocation[0] && Head[1] == FoodLocation[1]) {
        //  Did you beat the game?
        if (LogoPressed || Body.length == 25 && Level == 1) {
            StartLevel2()
        } else if (LogoPressed || Body.length == 22 && Level == 2) {
            StartLevel3()
        } else if (Body.length == 22 && Level == 3) {
            while (true) {
                basic.showString("YOU WON!!!")
            }
        }
        
        //  If it did, create a new food somewhere random
        GetNewFoodLocation()
    } else {
        //  If it didn't eat any food, then turn off the LED at the tail of the snake
        //  Since we only want the snake to grow if it ate food
        //  Turn off the LED at the Tail only if we didn't just cross here with the Head of the snake
        if (!(Head[0] == Tail[0] && Head[1] == Tail[1])) {
            led.unplot(Tail[0], Tail[1])
        }
        
        //  Now remove the Tail from the Body segments
        //  pop() will pop the last item off of the Body list (which will be the Tail)
        _py.py_array_pop(Body)
    }
    
    //  Pause the game for a second (1000 ms) to give the player some time to react!
    //  Otherwise the snake will run right into a wall before we even know what happened
    //  For a more challenging game, lower this number (try 750!)
    pause(GameSpeed)
}

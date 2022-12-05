#Youssef Cherrat - jja3em
#Charles Melvin - jgm6jy

import uvage

camera = uvage.Camera(800, 600)

xspeed = 10
yspeed = 10

screen_height = 600
screen_width = 800
game_on = True

holes = []

enemies = []

lives = 0

ticks = 0

character = uvage.from_color(30, screen_height - 50, "white", 30, 30)
def background():

    global game_on

    camera.clear("black")


    leftwall = uvage.from_color(0, screen_height/2, "yellow", 10, screen_height)
    bottomfloor = uvage.from_color(screen_width/2, screen_height, "yellow", screen_width, 30)

    # for floor in bottomfloor:
    #     camera.draw(floor)
    #     character.move_to_stop_overlapping(floor)


    camera.draw(leftwall)
    camera.draw(bottomfloor)
    camera.draw(character)
    if character.bottom_touches(bottomfloor):
        character.move_to_stop_overlapping(bottomfloor)
    if character.left_touches(leftwall):
        character.move_to_stop_overlapping(leftwall)
    if character.y == 800:
        game_on = False

def make_holes():
    global holes








def movement():
    global yspeed

    character.yspeed += 1

    if uvage.is_pressing("w"):
        character.y -= yspeed
    if uvage.is_pressing("a"):
        character.x -= xspeed
    if uvage.is_pressing("s"):
        character.y += yspeed
    if uvage.is_pressing("d"):
        character.x += xspeed
        


def livesisplay():
    """
    Calls the global score variable, and draws the score display based on a conditional
    The conditional containing, if a new floor is created, then iterate the score by one
    """
    global lives

    hit = 0
    lives_display = uvage.from_image(50, screen_height - 50, "https://i.pinimg.com/originals/b1/59/dc/b159dcb12e263619114705765d623ec1.png")

    # while hit < 3:
    #     if character.touches(enemies):
    #         lives_display = uvage.from_image(50, screen_height - 50, "https://i.pinimg.com/originals/b1/59/dc/b159dcb12e263619114705765d623ec1.png")
    #
    # camera.draw(lives_display)


def tick():
#game over conditionals
    global ticks


    background()


    ticks += 1

    movement()

    camera.display()


uvage.timer_loop(30, tick)



#Description of Game
#A metroid style game, where the user will control a sprite that can shoot enemies to advance and finish the level
#The level will consist of stationary obstacles and a permanent roof and floor to prevent out of bounds.
#A title screen to give the user a choice to choose the difficulty




#3 basic features of game
    #User Input Key binds: W = UP (character can go infinitly up with jetpack); A = Left movementd; D = Right movement, S = Crouch Feature
        #Left Click = shoot/attack from character
    #Game Over upon death of character: health bar point system, where if the character collides with the enemies a health point will deduct
        #When health points are zero, display game over message with restart button
    #Graphics/Images: 16 bit Sprite images of characteer and enemies, stationary obstacles images that restrict character movement

#4 addtional features
    #Multiple difficulty system: Easy = 3 health points, Medium = 2 health points, Hard = 1 health points
    #Health Bar: Health Bar system, in which the character can start with a pre-inputted amount and enemies can subtract from the health point system
    #Restart from Game Over: If character dies and runs out of health points, give user to respawn from the start
    #Enemies: Spawned enemies that move towards user and die with one hit from user attack
    #Sprite Animation: 16-bit character animation from attack input, movement animation for character based on up movement, enemy sprite dying animation
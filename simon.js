
let sounds = $("audio");
var givenSounds = [];
var clickedSounds = [];

let isFirstTry = true;

$(document).keydown("A", function () {
    if (isFirstTry) {
        makeSound();
        isFirstTry = false;
    }
})




$(".btn").click(function () {
    let parent = $(this);
    makeVisible(parent)
    let clicked = $(parent).find("audio")[0]
    clicked.play()
    clickedSounds.push(clicked);

    if (clickedSounds.length == givenSounds.length) {
        // let isSame = true;
        for (let i = 0; i < givenSounds.length; i++) {
           
            if (givenSounds[i] != clickedSounds[i]) {
                // isSame == false;
                alert("GameOver")
                // clickedSounds.length = 0;
                // givenSounds.length = 0
                return;
        }
        }

        setTimeout(() => {
            givenSounds.forEach((sound, i) => {
                setTimeout(() => {
                    let parent = $(sound).parent();
                    makeVisible(parent)
                    sound.play()
                }, (i + 1) * 500);
            });

            setTimeout(() => {
                makeSound();
            }, (givenSounds.length + 1) * 500);

            let score=$('#fscore').val(givenSounds.length);

            //cant work (why find)
            if (score > 3) {
                alert("You won!"); 
            } 

        }, 1000);

        //Before Playing
        clickedSounds.length = 0

    }
}
)



function makeSound() {
    let random = Math.floor(Math.random() * 4)
    let parent = $(sounds[random]).parent();
    makeVisible(parent)
    sounds[random].play()
    givenSounds.push(sounds[random]);
}

function makeVisible(parent) {
    parent.fadeIn(100).fadeOut(100).fadeIn(100);
}





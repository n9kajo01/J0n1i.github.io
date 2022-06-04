const speedElement = document.getElementById("speed");
const accelerationElement = document.getElementById("acceleration");
const incrementAccelerationButton = document.getElementById("incrementAcceleration");
const decrementAccelerationButton = document.getElementById("decrementAcceleration");
const speedOfLightEleemnt = document.getElementById("speedOfLight");
const resetButton = document.getElementById("reset");
const upgradesElement = document.getElementById("upgrades");


let speed = 0;
let acceleration = 0;
const speedOfLight = 299792458;
let mass = 1;
let energy = 1;
let cSpeed = 0;


incrementAccelerationButton.addEventListener("click", () => {
    speed += (acceleration / 10 + 0.1) / mass;
});

decrementAccelerationButton.addEventListener("click", () => {
    speed -= acceleration;
});

//reset
resetButton.addEventListener("click", () => {
    speed = 0; acceleration = 0;
    localStorage.clear("game");
    upgrades.forEach(element => {
        element.amount = 0;
    });
    EmptyList();
    RenderUpgrades();
});

//you can use stronger fuel when you're going faster
class Upgrade {
    amount = 0;
    name;
    cost = 0
    baseCost;
    accelerationBoost;

    constructor(name, baseCost, accelerationBoost, amount = 0) {
        this.amount = amount;
        this.name = name;
        this.accelerationBoost = accelerationBoost;
        this.baseCost = baseCost

    }
}

upgrades = []
upgrades[0] = new Upgrade("Hamster wheel", 1, 0.1)
upgrades[1] = new Upgrade("Jet fuel engine", 100, 1)
upgrades[2] = new Upgrade("Unicorn fart producer", 1000, 10)
upgrades[3] = new Upgrade("Fusion engine", 10000, 50)
upgrades[4] = new Upgrade("Super engine", 100000, 500)
upgrades[5] = new Upgrade("aaa", 1000000, 1500)
upgrades[6] = new Upgrade("bbb", 20000000, 10000)


function RenderUpgrades() {
    upgrades.forEach((e, index) => {
        button = document.createElement("button");
        li = document.createElement("li");
        p = document.createElement("p");

        button.setAttribute("id", index);

        e.cost = e.amount == 0 ?
            e.baseCost :
            (e.baseCost * ((
                Math.pow(1.15, e.amount + 1) - 1
            ))) / 0.15;

        displayCost = (e.cost / 1000).toFixed(2);
        displayCost = parseFloat(parseFloat(displayCost).toFixed(2)).toLocaleString("en-US", { useGrouping: true });

        displayAccelrationBoost = e.accelerationBoost
        displayAccelrationBoost = parseFloat(parseFloat(displayAccelrationBoost).toFixed(2)).toLocaleString("en-US", { useGrouping: true });

        p.innerHTML = e.amount + " " + e.name + " | Cost: " +
            (e.cost < 1000 ? e.cost.toFixed(2) + "m/s" : displayCost + "km/s")
            + " | Acceleration boost: " +
            (e.accelerationBoost < 1000 ? displayAccelrationBoost + "m/s2" : e.accelerationBoost / 1000 + "km/s2")


        button.innerHTML = e.name;

        li.appendChild(button)
        li.appendChild(p)
        upgradesElement.appendChild(li);


        button.addEventListener("click", (e) => {
            item = upgrades[e.target.id];
            if (speed >= item.cost) {
                item.amount++;
                acceleration += item.accelerationBoost;
                speed -= item.cost;
                EmptyList()
                RenderUpgrades();
            }
        });
    })

}

function EmptyList() {
    var child = upgradesElement.lastElementChild;
    while (child) {
        upgradesElement.removeChild(child);
        child = upgradesElement.lastElementChild;
    }
}

//Main Loop
setInterval(() => {
    energy = (1 / Math.sqrt(1 - ((speed / speedOfLight) * (speed / speedOfLight))))
    mass = 1 / Math.sqrt(1 - (speed * speed) / (speedOfLight * speedOfLight))

    /*
        console.log(1 / mass);
        console.log("energy: ", energy)
        console.log("acceleration: ", 1 / mass)
        console.log("mass: ", mass)
        */

    if (speed > 299792457.99) {
        speed = 299792457.99
        acceleration = 0;
        alert("While our ship has been traveling near the speed of light, our scientists have discovered dark matter. We can use it to go faster than c, but we have to stop to install a new engine.")
    } else {
        speed += (acceleration / mass) / 100;
    }

    let num = (speed / 1000).toFixed(2)

    num = parseFloat(parseFloat(num).toFixed(2)).toLocaleString("en-US", { useGrouping: true });


    speedElement.innerHTML = speed <= 1000 ? speed.toFixed(1) + "m/s" : num + "km/s";
    accelerationElement.innerHTML = acceleration >= 1000 ? ((acceleration / mass) / 1000).toFixed(2) + "km/s2" : (acceleration / mass).toFixed(1) + "m/s2";




    if (speed != 0) {
        let relativeToSpeedOfLight = speed / speedOfLight;
        relativeToSpeedOfLight = relativeToSpeedOfLight.toFixed(Math.floor(Math.abs(Math.log10(relativeToSpeedOfLight) - 3)));
        speedOfLightEleemnt.innerHTML = relativeToSpeedOfLight.toString().slice(0, -1) + "c"
    } else {
        speedOfLightEleemnt.innerHTML = 0 + "c"
    }



}, 10)

LoadGame();
SaveGame();

game = {}
time = 0;

function LoadGame() {
    game = JSON.parse(localStorage.getItem("game"))
    if (game == null) return
    acceleration = game.acceleration;
    speed = game.speed;
    time = (Date.now() - game.time)
    time = time / 1000;


    upgrades.map((e, index) => {
        e.amount = game.upgrades[index]
        if (e.amount == null || e.amount == undefined) e.amount = 0;
    })

    console.log("Time since last save: ", time)
    Object.keys(game).forEach(key => {
        if (key == null) {
            key = 0;
        }
    });


    if (time > 5) {
        alert("You've gained " + ((acceleration * time) / mass).toFixed(0) + "m/s since you were last here.")
        speed += ((acceleration * time) / mass)
    }


    RenderUpgrades();
}

function SaveGame() {
    game = {
        speed: speed,
        acceleration: acceleration,
        time: Date.now(),
        upgrades: upgrades.map(e => { return e.amount })
    }
    setTimeout(() => {
        SaveGame();
        localStorage.setItem("game", JSON.stringify(game));
    }, 1000)
}

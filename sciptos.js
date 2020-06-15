window.onload = function () {
    if ((window.innerWidth <= 1300) && (window.innerHeight <= 600)) {
        alert("No sakra, tohle nevypadá dobře. Vypadá to, že používáš mobilní zařízení s nízkým rozlišením. No co, když už jseš tady tak co s tebou mám dělat, ale nic ti negarantuju, je možný, že něco nebude fungovat úplně optimálně.");
    }
    obarvit();
}

let barvy = ['#41BBD9', '#006E90', '#F18F01', '#EC4E20', '#353531'];
let obtiznosti = ['NUDA', 'POHODA', 'NORMÁL', 'WOW!', '#g?*!'];
let velikosti = [{width:3, height:4, oblost: 2, okraj: 1}, {width:4, height:5, oblost: 2, okraj: 1}, {width:6, height:8, oblost: 2, okraj: 0.7}, {width:8, height:10, oblost: 1.5, okraj: 0.4}, {width:12, height:16, oblost: 1, okraj: 0.2}];
let sl = document.getElementById("slider");
let pocetdv;

sl.addEventListener("change", function () {
    obarvit();
});
function obarvit(){
    let barva = barvy[sl.value];
    document.getElementById("nastaveni").style.backgroundColor = barva;
    document.getElementById("obtiznost_napis").innerText = obtiznosti[sl.value];
    document.getElementById("bt_start").style.color = barva;
    document.getElementById("pseudomore").innerHTML = `#slider::-webkit-slider-thumb{background: ${barva};}#slider::-moz-range-thumb {background: ${barva};}`;
}

document.getElementById("bt_start").addEventListener("click", function () {
    document.getElementById("nastaveni").style.display = "none";
    document.getElementById("playground").style.display = "grid";
    document.getElementById("pseudomore").innerHTML = `.karticka{background-color: ${barvy[sl.value]};}`;
    document.getElementById("ukazatele").style.color = barvy[sl.value];
    document.getElementById("ukazatele").style.display = "grid";
    herniPole();
})
function herniPole() {
    let velikost = velikosti[sl.value];
    document.getElementById("playground").style.gridTemplateColumns =  `repeat(${velikost.height},calc(98vw / (20 * ${velikost.width}) * 8))`;
    document.getElementById("playground").style.gridTemplateRows =  `repeat(${velikost.width},calc(98vw / (20 * ${velikost.width}) * 8))`;
    for(let cnt = 0; cnt < (velikost.height * velikost.width); cnt++){
        let karticka = document.createElement("div");
        karticka.id = `karticka_${cnt}`;
        karticka.style.borderRadius = `${velikost.oblost}em`;
        karticka.style.borderWidth = `${velikost.okraj}em`;
        karticka.classList.add("karticka");
        document.getElementById("playground").appendChild(karticka);
        let obrazek = document.createElement("img");
        obrazek.alt = "obrazek-karticky";
        obrazek.classList.add("tajnyObr");
        obrazek.id = `tajnyObr_${cnt}`;
        karticka.appendChild(obrazek);
    }
    nactiobr(velikost);
}

function nactiobr(velikost){
    let rtrn = [];
    pocetdv = (velikost.width * velikost.height) / 2;
    let link = `https://pixabay.com/api/?key=4181928-959f1b3cb95ddc4704a3fc4a7&q=animal&image_type=photo&orientation=horizontal&per_page=${pocetdv}`;
    if(document.getElementById("safe_false").checked){
        link = `https://fadrny.ml/rimage/?p=${pocetdv}`;
    }
    fetch(link)
        .then(response => response.json())
        .then(data => {
            for(let cnt = 0; cnt < pocetdv; cnt++){
                let pic;
                if(document.getElementById("safe_false").checked){
                    pic = data[cnt].link;
                }
                else{
                    pic = data["hits"][cnt]["webformatURL"];
                }
                rtrn[rtrn.length] = {url: pic, conn: cnt};
                rtrn[rtrn.length] = {url: pic, conn: cnt};
            }
            rtrn = shuffle(rtrn);
            let pocitadlo = 0;
            for(let el of document.getElementsByClassName("tajnyObr")){
                el.src = rtrn[pocitadlo]["url"];
                pocitadlo++;
            }
        });
    startTime();
    return rtrn;
}

let otocene = [];
let najduto = 0;
let tahu = 0;
let cas = 0;

let sekunda;

function startTime(){
    sekunda = window.setInterval(function () {
        cas++;
        document.getElementById("nalezeno_in").innerText = najduto;
        document.getElementById("cas_in").innerText = cas;
        document.getElementById("tah_in").innerText = tahu;
        }, 1000);
}

document.getElementById("playground").addEventListener("click", event => {console.log(event.target);
if(event.target.classList[0] === "tajnyObr" && !otocene.includes(event.target)){
    otocene.push(event.target);
    event.target.style.opacity = "100";
    if(otocene.length > 2){
        otocene[0].style.opacity = "0";
        otocene[1].style.opacity = "0";
        otocene.splice(0, 2);
    }
    if(otocene.length > 1){
        if(otocene[0].src === otocene[1].src){
            otocene[0].parentElement.style.visibility = "hidden";
            otocene[1].parentElement.style.visibility = "hidden";
            najduto++;
        }
        tahu++;
    }
    if(najduto === pocetdv){
        window.clearInterval(sekunda);
        document.getElementById("input_jmeno").style.borderColor = barvy[sl.value];
        document.getElementById("input_jmeno_lbl").style.color = barvy[sl.value];
        document.getElementById("uloz_vysledek").style.color = barvy[sl.value];
        document.getElementById("konec").style.display = "grid";
    }
}
});

//https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}


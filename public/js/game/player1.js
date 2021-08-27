var otheruser, othercharacter, otherchar, othermove;
const char = dict[character];
socket.emit("joined", room, user, character);

socket.on("joined", (username, char2) => {
  document.getElementById("sound").play();
  document.getElementById("player2").style.display = "block";
  document.getElementById("chat").style.display = "block";  document.getElementById("allmoves-h1").style.display = "block";
  document.getElementById("message").innerHTML = "";
  otheruser = username;
  othercharacter = char2;
  otherchar = dict[char2];
  updateStatus();
  alertmodal("Joined!", `${user} has joined the room and their character is ${char2}! Have fun playing!`).then(() => {
    showMoves();
  });
});

socket.on("leave", username => {
  alertmodal("Left!", `${username} has left the game!`).then(() => location.href = "/join");
});

function updateStatus(){
  document.getElementById("names").innerHTML = `${char.name} (${user})`;
  document.getElementById("othernames").innerHTML = `${otherchar.name} (${otheruser})`;
  document.getElementById("player1-image").src = `/img/characters/${char.name}.png`;
  document.getElementById("player2-image").src = `/img/characters/${otherchar.name}.png`;
  document.getElementById("health").innerHTML = char.health;
  document.getElementById("progress").value = char.health;
  document.getElementById("otherhealth").innerHTML = char.health;
  document.getElementById("otherprogress").value = char.health;
}

function showMoves(){
  othertype = undefined;
  othervalue = undefined;
  othervalue1 = undefined;
  othervalue2 = undefined;
  otherrandint = undefined;
  otheroppovalue = undefined;
  document.getElementById("player1-message").innerHTML = "Your turn. Choose a move:";
  if(othermove){
    document.getElementById("player1-message").innerHTML = "The other player has chosen their move. Your turn. Choose a move:"
  }
  document.getElementById("player1-moves").innerHTML = "";
  let moves = char.moves;
  for(let i of Object.keys(moves)){
    let btn = document.createElement("button");
    btn.innerHTML = i;
    btn.onclick = () => {
      move(i);
    }
    document.getElementById("player1-moves").appendChild(btn);
  }
  // window.scrollTo(0, window.innerHeight);
}

function move(text){
  char.choosemove(text, otherchar).then(() => {
    let data = {};
    data.move = text;
    switch(type){
      case "attack":
        data.value = value;
        break;
      case "heal":
        data.value = value;
        break;
      case "chances":
        data.value1 = value1;
        data.value2 = value2;
        data.randint = randint;
        break;
      case "owndamage":
        data.value1 = value1;
        data.oppovalue = oppovalue;
        data.randint = randint;
        break;
    }
    data.type = type;
    socket.emit("move", room, data);
    document.getElementById("player1-message").innerHTML = "";
    document.getElementById("player1-moves").innerHTML = "";
    document.getElementById("player2-message").innerHTML = "Other player's turn.";
  });
  updateStatus();
}

function otherMove(text, data){
  othermove = true;
}

setTimeout(function(){window.open(location.href)}, 1000); // for testing
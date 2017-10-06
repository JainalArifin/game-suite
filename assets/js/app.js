var player1 = null;
var player2 = null;

var player1Name = "";
var player2Name = "";

var yourPlayerName = "";

var player1Choice = "";
var player2Choice = "";

var turn = 1;


var database = firebase.database();


database.ref("/players/").on("value", function(snapshot) {
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");


		player1 = snapshot.val().player1;
		player1Name = player1.name;


		$("#playerOneName").text(player1Name);
		$("#player1Stats").html("Menang: " + player1.Menang + ", Kalah: " + player1.Kalah + ", Imbang: " + player1.Imbang);
	} else {
		console.log("Player 1 does NOT exist");

		player1 = null;
		player1Name = "";

		$("#playerOneName").text("Menunggu Player 1...");
		$("#playerPanel1").removeClass("playerPanelTurn");
		$("#playerPanel2").removeClass("playerPanelTurn");
		database.ref("/outcome/").remove();
		$("#roundOutcome").html("Batu-Kertas-Gunting");
		$("#waitingNotice").html("");
		$("#player1Stats").html("Menang: 0, Kalah: 0, Imbang: 0");
	}

	if (snapshot.child("player2").exists()) {
		console.log("Player 2 exists");

	
		player2 = snapshot.val().player2;
		player2Name = player2.name;

		$("#playerTwoName").text(player2Name);
		$("#player2Stats").html("Menang: " + player2.Menang + ", Kalah: " + player2.Kalah + ", Imbang: " + player2.Imbang);
	} else {
		console.log("Player 2 does NOT exist");

		player2 = null;
		player2Name = "";


		$("#playerTwoName").text("Menunggu Player 2...");
		$("#playerPanel1").removeClass("playerPanelTurn");
		$("#playerPanel2").removeClass("playerPanelTurn");
		database.ref("/outcome/").remove();
		$("#roundOutcome").html("Batu-Kertas-Gunting");
		$("#waitingNotice").html("");
		$("#player2Stats").html("Menang: 0, Kalah: 0, Imbang: 0");
	}

	if (player1 && player2) {
		$("#playerPanel1").addClass("playerPanelTurn");


		$("#waitingNotice").html("menunggu " + player1Name + " untuk memilih");
	}

	if (!player1 && !player2) {
		database.ref("/turn/").remove();
		database.ref("/outcome/").remove();

		$("#playerPanel1").removeClass("playerPanelTurn");
		$("#playerPanel2").removeClass("playerPanelTurn");
		$("#roundOutcome").html("Batu-Kertas-Gunting");
		$("#waitingNotice").html("");
	}
});


database.ref("/turn/").on("value", function(snapshot) {
	if (snapshot.val() === 1) {
		console.log("TURN 1");
		turn = 1;

		
		if (player1 && player2) {
			$("#playerPanel1").addClass("playerPanelTurn");
			$("#playerPanel2").removeClass("playerPanelTurn");
			$("#waitingNotice").html("menunguu " + player1Name + " untuk memilih");
		}
	} else if (snapshot.val() === 2) {
		console.log("TURN 2");
		turn = 2;

		if (player1 && player2) {
			$("#playerPanel1").removeClass("playerPanelTurn");
			$("#playerPanel2").addClass("playerPanelTurn");
			$("#waitingNotice").html("menunggu " + player2Name + " untuk memilih");
		}
	}
});


database.ref("/outcome/").on("value", function(snapshot) {
	$("#roundOutcome").html(snapshot.val());
});



$("#add-name").on("click", function(event) {
	event.preventDefault();

	if ( ($("#name-input").val().trim() !== "") && !(player1 && player2) ) {
		// Adding player1
		if (player1 === null) {
			console.log("Adding Player 1");

			yourPlayerName = $("#name-input").val().trim();
			player1 = {
				name: yourPlayerName,
				Menang: 0,
				Kalah: 0,
				Imbang: 0,
				choice: ""
			};

			database.ref().child("/players/player1").set(player1);


			database.ref().child("/turn").set(1);

			database.ref("/players/player1").onDisconnect().remove();
		} else if( (player1 !== null) && (player2 === null) ) {
			console.log("Adding Player 2");

			yourPlayerName = $("#name-input").val().trim();
			player2 = {
				name: yourPlayerName,
				Menang: 0,
				Kalah: 0,
				Imbang: 0,
				choice: ""
			};

			database.ref().child("/players/player2").set(player2);

			database.ref("/players/player2").onDisconnect().remove();
		}

		var msg = yourPlayerName + " has joined!";
		console.log(msg);

		var romm = database.ref().child("/romm/").push().key;

		database.ref("/romm/" + romm).set(msg);

		$("#name-input").val("");	
	}
});


$("#playerPanel1").on("click", ".panelOption", function(event) {
	event.preventDefault();

	if (player1 && player2 && (yourPlayerName === player1.name) && (turn === 1) ) {
		// Record player1's choice
		var choice = $(this).text().trim();

		player1Choice = choice;
		database.ref().child("/players/player1/choice").set(choice);

		turn = 2;
		database.ref().child("/turn").set(2);
	}
});


$("#playerPanel2").on("click", ".panelOption", function(event) {
	event.preventDefault();

	if (player1 && player2 && (yourPlayerName === player2.name) && (turn === 2) ) {
		// Record player2's choice
		var choice = $(this).text().trim();

		player2Choice = choice;
		database.ref().child("/players/player2/choice").set(choice);

		rpsCompare();
	}
});

function rpsCompare() {
	if (player1.choice === "Batu") {
		if (player2.choice === "Batu") {
			console.log("Imbang");

			database.ref().child("/outcome/").set("imbang!");
			database.ref().child("/players/player1/Imbang").set(player1.Imbang + 1);
			database.ref().child("/players/player2/Imbang").set(player2.Imbang + 1);
		} else if (player2.choice === "Kertas") {
			// Player2 Menang
			console.log("Kertas Menang");

			database.ref().child("/outcome/").set("Kertas Menang!");
			database.ref().child("/players/player1/Kalah").set(player1.Kalah + 1);
			database.ref().child("/players/player2/Menang").set(player2.Menang + 1);
		} else { // Gunting
			// Player1 Menang
			console.log("Batu Menang");

			database.ref().child("/outcome/").set("Batu Menang!");
			database.ref().child("/players/player1/Menang").set(player1.Menang + 1);
			database.ref().child("/players/player2/Kalah").set(player2.Kalah + 1);
		}

	} else if (player1.choice === "Kertas") {
		if (player2.choice === "Batu") {
			// Player1 Menang
			console.log("Kertas Menang");

			database.ref().child("/outcome/").set("Kertas Menang!");
			database.ref().child("/players/player1/Menang").set(player1.Menang + 1);
			database.ref().child("/players/player2/Kalah").set(player2.Kalah + 1);
		} else if (player2.choice === "Kertas") {
			// Imbang
			console.log("Imbang");

			database.ref().child("/outcome/").set("imbang!");
			database.ref().child("/players/player1/Imbang").set(player1.Imbang + 1);
			database.ref().child("/players/player2/Imbang").set(player2.Imbang + 1);
		} else {
			// Player2 Menang
			console.log("Gunting Menang");

			database.ref().child("/outcome/").set("Gunting Menang!");
			database.ref().child("/players/player1/Kalah").set(player1.Kalah + 1);
			database.ref().child("/players/player2/Menang").set(player2.Menang + 1);
		}

	} else if (player1.choice === "Gunting") {
		if (player2.choice === "Batu") {
			// Player2 Menang
			console.log("Batu Menang");

			database.ref().child("/outcome/").set("Batu Menang!");
			database.ref().child("/players/player1/Kalah").set(player1.Kalah + 1);
			database.ref().child("/players/player2/Menang").set(player2.Menang + 1);
		} else if (player2.choice === "Kertas") {
			// Player1 Menang
			console.log("Gunting Menang");

			database.ref().child("/outcome/").set("Gunting Menang!");
			database.ref().child("/players/player1/Menang").set(player1.Menang + 1);
			database.ref().child("/players/player2/Kalah").set(player2.Kalah + 1);
		} else {
			// Imbang
			console.log("Imbang");

			database.ref().child("/outcome/").set("imbang!");
			database.ref().child("/players/player1/Imbang").set(player1.Imbang + 1);
			database.ref().child("/players/player2/Imbang").set(player2.Imbang + 1);
		}

	}

	turn = 1;
	database.ref().child("/turn").set(1);
}

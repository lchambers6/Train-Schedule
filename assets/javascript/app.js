
$(document).ready(function() {
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAVhq-4yEpkFVUhnCEJX1sVBsqkawSEL-s",
    authDomain: "trainscheduler-b8b38.firebaseapp.com",
    databaseURL: "https://trainscheduler-b8b38.firebaseio.com",
    projectId: "trainscheduler-b8b38",
    storageBucket: "trainscheduler-b8b38.appspot.com",
    messagingSenderId: "35380776753"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var currTime = moment();
  var diffTime = 0;

	$('#submitButton').on('click', function() {
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var firstTrainTime = moment().hour(parseInt(firstTrain.slice(0, firstTrain.indexOf(":"))));
    firstTrainTime = moment(firstTrainTime).minute(parseInt(firstTrain.slice(firstTrain.indexOf(":") + 1)));
    var freq = $("#freq").val().trim();
    checkTime(firstTrainTime, freq);
    var nextTrain = moment(firstTrainTime);
    var localDiffTime = (moment(nextTrain).diff(moment(), "minutes"));
    database.ref().push({
      trainName: trainName,
      destination: destination,
      freq: freq,
      nextArrival: moment(nextTrain).format("HH:mm"),
      minsAway: localDiffTime
    });
	});

  function checkTime(firstTrainTime, freq) {
    diffTime = moment(firstTrainTime).diff(moment(), "minutes");
    if (diffTime < 0) {
      firstTrainTime = firstTrainTime.add(freq, "minutes");
      checkTime(firstTrainTime, freq)
    } else {
      diffTime = moment(firstTrainTime).diff(moment(), "minutes");
    }
  };

  database.ref().on("child_added", function(snapshot) {
    $("#trainSchedule").append("<tr><td>" + snapshot.val().trainName + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().freq + "</td><td>" + snapshot.val().nextArrival + "</td><td>" + snapshot.val().minsAway + "</td></tr>");
  });

  database.ref().on("child_removed", function(snapshot) {
    $("#trainSchedule").empty();
    $("#trainSchedule").html("<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr>");
  });

  // database.ref().on("child_changed", function(snapshot) {
  //   console.log(currTime);
  // });

  $("#clearButton").on("click", function(event) {
    event.preventDefault();
    database.ref().remove();
  });

  // var datetime = null,
  //       date = null;

  // var update = function () {
  //     date = moment(new Date())
  //     datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
  //     currTime = date.format('dddd, MMMM Do YYYY, h:mm:ss a');
  //     database.ref().update({currTime: currTime})
  // };

  // $(document).ready(function(){
  //     datetime = $('#datetime')
  //     update();
  //     setInterval(update, 1000);
  // });

});

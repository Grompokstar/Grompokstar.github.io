(function() {

  $( document ).ready(function() {
    startTimer();

    function startTimer() {
      /* var date = $('#input-date').val();
       var time = $('#input-time').val();

       console.log(date);
       console.log(time);

       var dateArray = date.split('-');
       var timeArray = time.split(':');
       console.log(dateArray);
       console.log(timeArray);*/

      var now = new Date();
      var startDate = new Date(2017, 7, 3, 21, 0, 0, 0);
      var secondsDifference = (now - startDate)/1000;

      var counts = countTimes(secondsDifference);

      setInterval(function() {
        secondsDifference++;
        countTimes(secondsDifference);
      }, 1000)


    }

    function countTimes(seconds) {
      var outputDays = document.getElementById('output-days');
      var outputHours = document.getElementById('output-hours');
      var outputMinutes = document.getElementById('output-minutes');
      var outputSeconds = document.getElementById('output-seconds');

      var daysCount = Math.floor(seconds/86400);
      var daysRemain = seconds % 86400;
      var hourCount = Math.floor(daysRemain/3600);
      var hourRemain = daysRemain % 3600;
      var minutesCount = Math.floor(hourRemain/60);
      var secondsCount = Math.floor(hourRemain % 60);

      outputDays.innerHTML = daysCount;
      outputHours.innerHTML = hourCount;
      outputMinutes.innerHTML = minutesCount;
      outputSeconds.innerHTML = secondsCount;

    }
  });

})();


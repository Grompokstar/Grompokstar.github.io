$(function(){
  function Calendar(holder,input) {
    this.oDate = new Date();
    this.year = this.year || this.oDate.getFullYear();
    this.month = this.oDate.getMonth();
    this.today = this.oDate.getDay();
    this.daysTotal = new Date(this.year, this.month + 1, 0).getDate();
    this.firstDay = new Date(this.year, this.month, 1).getDay();
    this.holder = holder;
    this.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    this.months2 = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    this.days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    this.previousMonthDaysTotal = new Date(this.year, this.month, 0).getDate();
    this.selectedYear = this.oDate.getFullYear();
    this.selectedMonth = this.oDate.getMonth();
    this.selectedDate = this.oDate.getDate();
    this.initDay = this.oDate.getDay();

    this.countMonth = function() {
      this.daysTotal = new Date(this.year, this.month + 1, 0).getDate();
      this.firstDay = new Date(this.year, this.month, 1).getDay();
      this.previousMonthDaysTotal = new Date(this.year, this.month, 0).getDate();
    };

    if (this.initDay === 6) {
      this.selectedDate += 2;
    } else if (this.initDay === 0) {
      this.selectedDate += 1;
    }

    var initRender = true;
    var initMonthId = this.month;
    var initYear = this.year;
    var initDay = this.oDate.getDate();


    this.render = function() {
      var holder = document.getElementById(this.holder);

      function dc(a) {
        return document.createElement(a);
      }
      function ct(a) {
        return document.createTextNode(a);
      }


      if (initRender) {
        var monthControl = dc('div');
        monthControl.classList.add('month-control');

        var monthContainer = dc('div');
        monthContainer.classList.add('month-container');

        var monthScrollContainer = dc('div');
        monthScrollContainer.classList.add('month-scroll-container');

        var monthItem = dc('div');
        monthItem.classList.add('month-item');

        for (i = this.month; i < this.month + 12; i++){
          var j;
          if (i <= 11) {
            j = i
          } else {
            j = i-12;
          }
          var monthCaption = document.createTextNode(this.months[j]);
          var monthItem = dc('div');
          monthItem.classList.add('month-item');
          monthItem.setAttribute('data-month-id', i > 11 ? i - 12 : i);

          if (i == this.month) {
            monthItem.classList.add('current');
          }

          monthItem.onclick = function(e) {
            e.stopPropagation();
            $('.month-item').removeClass('current');
            this.classList.add('current');

            var clickedMonthId = parseInt(this.getAttribute('data-month-id'));

            self.month = clickedMonthId;
            if (clickedMonthId < initMonthId) {
              self.year = initYear + 1
            } else {
              self.year = initYear
            }

            self.countMonth();
            self.render();
          };

          monthItem.appendChild(monthCaption);
          monthScrollContainer.appendChild(monthItem);
        }
        monthContainer.appendChild(monthScrollContainer);
        monthControl.appendChild(monthContainer);
      }



      var table = dc("table");
      table.className = "js_cal";

      var thead = dc("thead");
      var tr = dc("tr");
      var td = dc("td");
      var th = dc("th");
      var span = dc("span");

      var self = this;

      tbody = dc("tbody");
      tr = dc("tr");

      for (i = 0; i < 7; i++){
        var day_caption = document.createTextNode(this.days[i]);
        th = dc("th");
        th.appendChild(day_caption);
        tr.appendChild(th);
        thead.appendChild(tr);
      }

      table.appendChild(thead);

      table.appendChild(tbody);

      if (this.firstDay == 0) this.firstDay = 7;

      var v = Math.ceil((this.daysTotal + this.firstDay - 1) / 7);
      var tbody = dc("tbody");

      day = 1;
      for(i = 0; i < v; i++){
        tr = dc("tr");
        var nextMonthDay = 1;
        for(j = 0; j < 7; j++){
          if (i == 0 && j < this.firstDay-1) {
            var day_n = document.createTextNode(this.previousMonthDaysTotal - (this.firstDay-(j+2)));
            td = dc("td");
            if (j >=5 && j <=6) {
              td.classList.add('holiday')
            }
            td.classList.add('unavailable');
            td.appendChild(day_n);
            tr.appendChild(td);

          } else if (day <= this.daysTotal && (i > 0 || j >= this.firstDay-1)){
            var day_n = document.createTextNode(day);
            td = dc("td");
            td.setAttribute("Class","date");
            td.appendChild(day_n);

            if (initMonthId == this.month && day == initDay) {
              td.classList.add('current');
              if(initRender && j < 5) {
                td.classList.add('active');
              }
            }

            if (initMonthId == this.month && day < initDay) {
              td.classList.add('unavailable');
            } else if (j >=5) {
              td.classList.add('holiday');
            } else {
              var span = dc("span");
              span.classList.add('month-name');
              var month = self.months2[self.month];
              span.appendChild(ct(month));
              td.appendChild(dc('br'));
              td.appendChild(span);
              td.onclick = selectDate;
            }

            if (this.month === this.selectedMonth && day == this.selectedDate && this.year === this.selectedYear) {
              td.classList.add('active');
              td.click();
            }

            tr.appendChild(td);
            day++;
          } else {
            var day_n = document.createTextNode(nextMonthDay);
            td = dc("td");
            td.classList.add('unavailable');
            td.appendChild(day_n);
            tr.appendChild(td);
            nextMonthDay++;
          }
          tbody.appendChild(tr)
        }
        table.appendChild(tbody);
      }

      if (holder.lastChild) holder.removeChild(holder.lastChild);
      if (initRender) {
        holder.appendChild(monthControl);
      }

      holder.appendChild(table);
      initRender = false;

      this.cells = document.getElementById(this.holder).getElementsByTagName("tbody")[1].getElementsByTagName('td');

      function selectDate() {
        $('.js_cal td').removeClass('active');

        document.getElementById(input).value = parseInt(this.innerHTML) + "." + (self.month + 1) + "." + self.year;
        this.classList.add('active');

        var dateText = parseInt(this.innerHTML) + ' ' + $(this).find('.month-name').text();

        document.getElementById('date-output').innerText = dateText;

        self.selectedYear = self.year;
        self.selectedMonth = self.month;
        self.selectedDate = parseInt(this.innerHTML);
      }

    }

  }

  $(window).ready(function(){
    var cal = new Calendar("datepicker","date-input");
    cal.render();
    $('#date-input').hide();


    // слайдер для выбора месяца
    $('.month-control').on('click', function(event) {
      var $scrollContainer = $(this).find('.month-scroll-container');
      var startLeft = parseInt($scrollContainer.css('left'));

      if(event.originalEvent.offsetX > 0 && startLeft > -752) {
        if (startLeft < -655) {
          $scrollContainer.css('left', '-715px');
        } else {
          $scrollContainer.css('left',  (startLeft - 97) + 'px');
        }
      } else if (event.originalEvent.offsetX < 0 && startLeft < 0) {
        if (startLeft > -97) {
          $scrollContainer.css('left',  '0px');
        } else {
          $scrollContainer.css('left',  (startLeft + 97) + 'px');
        }
      }

    });
    //----------------------------------------


    //рендер тайм слотов
    var timeSlotsData = [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '12:00', available: false },
      { time: '13:00', available: true },
      { time: '14:00', available: false },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true },
      { time: '18:00', available: true }
    ];

    var timeSlots = document.getElementById('time-slots');

    timeSlotsData.forEach(function(item, i) {
      var slot = document.createElement('div');
      slot.classList.add('time-slot-item');

      if(!item.available) {
        slot.classList.add('unavailable');
      }

      var time = document.createTextNode(item.time);
      slot.appendChild(time);

      timeSlots.appendChild(slot);
    })
    //--------------------------------------------



  });

}());
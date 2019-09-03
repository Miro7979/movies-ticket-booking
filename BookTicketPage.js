class BookTicketPage extends Component {
  constructor(props) {
    super(props);
    this._props = props
    this.auditorium = {}
    this.movie = {}
    this.adult = 2;
    this.kid = 0;
    this.senior = 0;
    this.total = 170;
    this.totalTickets = 2;
    this.program = {};
    this.wholeMovie = {}
    this.ticket = {}
    this.showSalong = true;
    this.seatsForTicket = "<br>";
    this.error = "";
    this.toMannyTickets = "";
    this.errorCantBookThese = "";
    this.addRoute(/\/program\/(.*)/, 'Visning')
    this.addEvents({
      'click .booked-tickets': 'bookSeat',
      'click .decrement-kid': 'decrementKid',
      'click .increment-kid': 'incrementKid',
      'click .decrement-adult': 'decrementAdult',
      'click .increment-adult': 'incrementAdult',
      'click .decrement-senior': 'decrementSenior',
      'click .increment-senior': 'incrementSenior',
      'mouseout .seat, .choosenSeat': 'reloadSalong',
      'click .seat, .choosenSeat': 'reloadSalongIfBooked'
    });
  }
  async mount() {
    this.showSalong = true;
    this.adult = 2;
    this.kid = 0;
    this.senior = 0;
    this.total = 170;
    this.totalTickets = 2;
    this.error = "";
    this.toMannyTickets = "";
    this.errorCantBookThese = "";
    this.id = this.routeParts[0];
    this.salong = new Salong();
    this.program = await Program.find(`.findById('${this.id}').populate('movie auditorium').exec()`);
    this.bookedTicket = await Ticket.find(`.find({programId: '${this.id}'})`);
    this.wholeMovie = await Movie.find(`.findOne({'title': '${this.program.movie._props.title}'}).populate('movie auditorium').exec()`);
    this.salongen = await this.salong.getSalong(this.program.auditorium.name);
    document.title = 'Program: ' + this.program.movie.title;
    Object.assign(this, this.program._props);
    this.getBookedSeats();
    this.render();

  }
  unmount() {
    delete this.salong;
    delete this.wholeMovie;
  }

  reloadSalongIfBooked() {
    for (let rows = 0; rows < this.salong.salong.length; rows++) {
      let seats = this.salong.salong[rows].row[0]
      for (let seat = 0; seat < seats.length; seat++) {
        if (seats[seat].baseEl[0].className == 'hoverChoosenSeat') {
          this.render();
        }
      }
    }
    this.getBookedSeats()

  }

  reloadSalong() {
    this.chair = 0

    for (let rows = 0; rows < this.salong.salong.length; rows++) {
      let seats = this.salong.salong[rows].row[0]
      for (let seat = 0; seat < seats.length; seat++) {
        if (seats[seat].baseEl[0].className == 'hoverChoosenSeat') {
          this.chair += 1
        }
        if (seats[seat].baseEl[0].className == 'choosenSeat') {
          seats[seat].baseEl[0].className = 'seat'
        }
      }
    }

    if (this.chair < 1) {
      this.getBookedSeats()
      this.render();
    }
  }

  async getBookedSeats() {
    for (let seatBooked of this.bookedTicket) {
      for (let chair of seatBooked.seats) {
        for (let rows = 0; rows < this.salong.salong.length; rows++) {
          let seats = this.salong.salong[rows].row[0]
          for (let seat = 0; seat < seats.length; seat++) {
            if (seats[seat].seatNumber == chair.Seat) {
              let unavailableSeat = await seats[seat]
              unavailableSeat.baseEl[0].className = 'unavailableSeat';

            }
          }
        }
      }
    }
  }


  async bookSeat() {

    this.bookedTicket = await Ticket.find(`.find({programId: '${this.id}'})`);

    this.bookedInDatabas = []

    for (let seatBooked of this.bookedTicket) {
      for (let chair of seatBooked.seats) {
        for (let rows = 0; rows < this.salong.salong.length; rows++) {
          let seats = this.salong.salong[rows].row[0]
          for (let seat = 0; seat < seats.length; seat++) {
            if (seats[seat].seatNumber == chair.Seat) {
              let unavailableSeat = await seats[seat].seatNumber
              this.bookedInDatabas.push(unavailableSeat);

            }
          }
        }
      }
    }

    let user = await Login.find();

    let Num = new BookingNumber();
    this.bookingNum = await Num.getBookingNumber();

    this.booking = [];

    //loop thru the seats in the cinema
    for (let rows = 0; rows < this.salong.salong.length; rows++) {
      let seats = this.salong.salong[rows].row[0]
      for (let seat = 0; seat < seats.length; seat++) {
        if (seats[seat].baseEl[0].className == 'hoverChoosenSeat') {
          this.booked = this.bookedSeat = { Row: seats[seat].rowNumber, Seat: seats[seat].seatNumber };
          this.booking.push(this.booked);
          this.errorCantBookThese = '';
        }
      }
    }

    for (let rows = 0; rows < this.salong.salong.length; rows++) {
      let seats = this.salong.salong[rows].row[0]
      for (let seat = 0; seat < seats.length; seat++) {
        if (seats[seat].baseEl[0].className == 'hoverChoosenSeat') {
          for(let bookedSeatNum of this.bookedInDatabas){
            if(bookedSeatNum == seats[seat].seatNumber){
              this.errorCantBookThese = `<div class="alert alert-danger mt-4" role="alert"> Någon bokade dessa platserna medans du väntade, var god och välj andra platser! </div>`;
              this.getBookedSeats()
              this.render();
            }
          }
        }
      }
    }

    if (this.totalTickets == this.booking.length & this.totalTickets > 0 && this.errorCantBookThese =='') {

      let elements = document.getElementsByClassName('hoverChoosenSeat');
      for (let i = elements.length - 1; i >= 0; --i) {
        elements[i].className = 'unavailableSeat';
      }

      this.ticket = new Ticket({
        "bookingNum": this.bookingNum,
        "purchasedAt": new Date(),
        "price": this.total,
        "user": user.email,
        "program": this.program,
        "programId": this.id,
        "seats": this.booking.reverse()
      })

      await this.ticket.save();

      for (const seatAndRow of this.booking) {
        this.seatsForTicket += "Rad " + seatAndRow.Row
        this.seatsForTicket += " Stol " + seatAndRow.Seat + ". <br>"

      }
      this.showSalong = false;
      this.render()
      this.seatsForTicket = "<br>";
      this.showSalong = true;
      this.adult = 2;
      this.totalTickets = 2;

    } else if(this.errorCantBookThese == '') {
      this.error = `<div class="alert alert-danger mt-4" role="alert"> Välj rätt antal platser för att boka! </div>`
      this.getBookedSeats()
      this.render();
    }

  }

  decrementKid() {
    if (this.kid) {
      this.kid--
      this.total -= 50
      this.getBookedSeats()
      this.totalTickets--
      this.toMannyTickets = "";
      this.render();
    }
  }
  incrementKid() {
    if (this.totalTickets < 7) {
      this.kid++
      this.total += 50
      this.getBookedSeats()
      this.totalTickets++
      this.render();
    } else {
      this.toMannyTickets = `<div class="alert alert-danger mt-4" role="alert"> Det går bara att boka 7 biljetter åt gången! </div>`
      this.getBookedSeats()
      this.render();
    }
  }
  decrementAdult() {
    if (this.adult) {
      this.adult--
      this.total -= 85
      this.getBookedSeats()
      this.totalTickets--
      this.toMannyTickets = "";
      this.render();
    }
  }
  incrementAdult() {
    if (this.totalTickets < 7) {
      this.adult++
      this.total += 85
      this.getBookedSeats()
      this.totalTickets++
      this.render();
    } else {
      this.toMannyTickets = `<div class="alert alert-danger mt-4" role="alert"> Det går bara att boka 7 biljetter åt gången! </div>`
      this.getBookedSeats()
      this.render();
    }
  }
  decrementSenior() {
    if (this.senior) {
      this.senior--
      this.total -= 65
      this.getBookedSeats()
      this.totalTickets--
      this.toMannyTickets = "";
      this.render();
    }
  }
  incrementSenior() {
    if (this.totalTickets < 7) {
      this.senior++
      this.total += 65
      this.getBookedSeats()
      this.totalTickets++
      this.render();
    } else {
      this.toMannyTickets = `<div class="alert alert-danger mt-4" role="alert"> Det går bara att boka 7 biljetter åt gången! </div>`
      this.getBookedSeats()
      this.render();
    }
  }
}
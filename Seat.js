class Seat extends Component {
  constructor(seats, rows, props) {
    super(props);
    this.seatNumber = seats;
    this.rowNumber = rows;
    this.choosenSeats = 0;
    this.addEvents({
      'click': 'getSeat',
      'mouseenter': 'hover'
    });
  }

  async getSeat() {

    for (let valdaPlatser of this.test2) {
      valdaPlatser.baseEl[0].className = 'hoverChoosenSeat'
    }

  }

  hover() {

    this.test2 = []

    if (App.bookTicketsPage.totalTickets > this.choosenSeats) {
      this.baseEl[0].className = 'choosenSeat'
    }

    for (let rows = 0; rows < App.bookTicketsPage.salong.salong.length; rows++) {
      let seats = App.bookTicketsPage.salong.salong[rows].row[0]
      for (let seat = 0; seat < seats.length; seat++) {
        if (seats[seat].baseEl[0].className == 'choosenSeat') {
          this.test2.push(seats[seat])
          for (let i = 1; i < App.bookTicketsPage.totalTickets; i++) {
            this.test2.push(seats[seat += 1])
          }
        }
      }
    }

    for (let valdaPlatser of this.test2) {
      if (valdaPlatser.baseEl[0].className == 'hoverChoosenSeat') {
      } else {
        valdaPlatser.baseEl[0].className = 'choosenSeat'
      }
    }

    App.bookTicketsPage.getBookedSeats()
  }
}
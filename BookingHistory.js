class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.addRoute('/mina-bokningar', 'Mina bokningar');
    this.tickets = [];
    this.show = false;
    this.noBookings = false;
    this.oldBookings = [];
    //this.generateBookingHistory();  
    this.addEvents({
      //  'click .getBook': 'generateBookingHistory',

    });
  }

  mount() {
    this.tickets = [];
    this.oldBookings = [];
    this.generateBookingHistory();
    //this.render();
  }

  async generateBookingHistory() {
    this.show = true;
    this.noBookings = false;
    let currentDate = new Date().toISOString().slice(0, 10);
    let time = new Date().toString().substr(16, 8)
    let tmpTickets = [];
    tmpTickets = await Ticket.find();
    let tmpEmail = await Login.find();
    for (let i = 0; i < tmpTickets.length; i++) {
      if (tmpTickets[i].user === tmpEmail.email) {
        if (tmpTickets[i].program.date <= currentDate) {
          if (tmpTickets[i].program.time > time.substring(0, 5) && currentDate <= tmpTickets[i].program.date) {
            this.tickets.push(tmpTickets[i]);
          }
          else {
            this.oldBookings.push(tmpTickets[i])
          }
        }
        else {
          this.tickets.push(tmpTickets[i]);
        }
      }
    }


    if (this.tickets.length <= 0 && this.oldBookings.length <= 0) {
      this.show = false;
      this.noBookings = true;
    }
    this.oldBookings.reverse();
    this.tickets.reverse();
    this.render();
  }
}
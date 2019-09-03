class Salong extends Component {
  constructor(props) {
    super(props);
    this.salong = [];
    this.rows = 1
    this.seats = 0;

  }


  async getSalong(salongName) {
    let auditorium = await Auditorium.find('.findOne({name: /' + salongName + '/})');
    if (!auditorium) {
      return
    }

    for (let numberOfSeatsInRow of auditorium.seatsPerRow) {
      let row = [];
      this.seats += numberOfSeatsInRow;
      this.seatRow = new SeatRow();
      // create one row of seats

      for (let seatCounter = 0; seatCounter < numberOfSeatsInRow; seatCounter++) {
        row.push(new Seat(this.seats, this.rows, this._props));
        this.seats--
      }
      this.seats += numberOfSeatsInRow

      this.rows++
      this.seatRow.row.push(row);
      this.salong.push(this.seatRow);
      this.render();
    }
    return this.salong;
  }


}
class Program extends Component {
  constructor(props) {
    super(props);
    this._props = props
    this.movie = new Movie(this.movie);
    this.auditorium = new Auditorium(this.auditorium);

  }
}
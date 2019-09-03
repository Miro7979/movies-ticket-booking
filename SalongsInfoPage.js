class SalongsInfoPage extends Component {
  constructor(props) {
    super(props);
    this.addRoute('/salongs-info', 'Salonger');
    this.auditorium;
  }
  async mount() {
    this.auditorium = await Auditorium.find();
    this.render();
  }



}
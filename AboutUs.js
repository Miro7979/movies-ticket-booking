
class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.addRoute('/about-us', 'Om Oss');
    this.auditorium;
    this.loadAuditorium();
  }
  async loadAuditorium() {
    this.auditorium = await Auditorium.find();
  }

}
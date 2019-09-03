class StartPage extends Component {

  constructor() {
    super();
    this.addRoute('/', 'Start');
    this.foundMovies
    this.generateMovies()
  }
  async generateMovies() {
    this.foundMovies = await Movie.find();
  }
}
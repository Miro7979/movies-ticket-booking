class Movie extends Component {
  constructor(props) {
    super(props);
    if (this.title) {
      let url = '/movie/' + this.title.toLowerCase().replace(/\W/g, '-');
      this.addRoute(url, 'Movie: ' + this.title);
    }
    this.getHoursFromTime();
    this.time;

    this.addEvents({
      'click #exampleModalCenter': 'modal',

    });
  }

  modal(){
    console.log('modal')
    this.render();
  }

  getHoursFromTime(){
      let num = this.length;
      let hours = (num / 60);
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      this.time = rhours + " tim " + rminutes + " min";
  }

  async mount(){
    let program = await Program.find(`.find({ movie: { $in: ["${this._id}"] } })`)

    this.show = [];
    for(let i = 0; i < program.length; i++){
      let auditorium = program[i]._props.auditorium 
      await this.show.push(new Shows(this._id, i, auditorium));
    }

    this.render();
  }
}

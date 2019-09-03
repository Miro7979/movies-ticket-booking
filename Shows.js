class Shows extends Component {
    constructor(movieID, programIndex, auditorium) {
      super();
      this.movieID = movieID;
      this.programIndex = programIndex;
      this.auditorium = auditorium
      this.showsInProgram();
    }

    async showsInProgram(){
        let program = await Program.find(`.find({ movie: { $in: ["${this.movieID}"] } })`);
        this.salong = await Auditorium.find(this.auditorium);
        this.show = program[this.programIndex]
        this.render();
    }
  }
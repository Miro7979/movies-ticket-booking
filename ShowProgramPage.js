class ShowProgramPage extends Component {

  constructor(props) {
    super(props);
    this.addRoute('/show-program', 'Visningar');
    this.addEvents({
      'click .select-program': 'selectProgram',
      'click .more-programs': 'morePrograms',

    });
    this.programCounter = 12;
    this.programs = [];
    this.generateProgramsList();
    this.selectedProgram = {};
  }

  async generateProgramsList() {
    this.programs = await Program.find(`.find().populate('movie auditorium').sort({date: 1, time: 1}).limit(${this.programCounter}).exec()`);
    this.render();
  }
  async morePrograms() {
    let allPrograms = await Program.find();
    if (allPrograms.length > this.programCounter) {
      this.programCounter += 12;
      this.generateProgramsList()
    }
  }



  async selectProgram(e) {
    let programId = $(e.currentTarget).data("id");
    App.programId = programId;

    this.render();
  }

}
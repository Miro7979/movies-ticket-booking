class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.currentUser = "";
    this.currentUserInfo = "";
    this.currentUserName = "";
    this.currentUserName = "";
    this.currentUserEmail = "";
    this.hideLogin = false;
    this.showError = false;
    this.showErrorPassword = false;
    this.addRoute('/login', 'Login');
    this.addEvents({
      'submit form': 'userLogin',
      'click .relocate': 'relocate',
      'click .logout': 'userLogout',
      'click .resetLogin': 'mount'
    });

  }

  mount() {
    this.hideLogin = false;
    this.showError = false;
    this.showErrorPassword = false;
    this.render();
  }

  async userLogin(e) {

    e.preventDefault();

    let newLogin = new Login(
      {
        email: this.baseEl.find('#user-email').val(),
        password: this.baseEl.find('#user-password').val()
      }
    )
    let user = await User.find(`.find({email: '${newLogin.email}'})`);


    let result = await newLogin.save();
    let test = await Login.find();
    if (result.error && result.error == "The password does not match!") {
      this.hideLogin = true;
      this.showErrorPassword = true;
      this.render();
      return;
      // Store.navbar.render();
      // this.render();
    }
    else if (result.error == "Not logged in!" || result.error == "No such user!" || test.error == "Not logged in!") {
      this.hideLogin = true;
      this.showError = true;
      // this.render();
      return;
      // Store.navbar.render();
      // this.render();
    }

    else if (result.loggedIn === true && test.error != "Not logged in!") {
      this.currentUserInfo = user[0];
      this.currentUserName = user[0].firstName;
      this.currentUserEmail = user[0].email;
      Store.currentUser = user[0].email;
      Store.loggedIn = true;
      Store.userIsLoggedIn = true;
      // Store.currentUser = user[0].firstName;
      //   newLogin.save();
      this.currentUser = newLogin;
      // Store.navbar.render();
      // this.render();

    }
    Store.navbar.render();
    this.render();
  }


  //JQUERY
  // console.log(userFirstName);
  //   $('.login-form').empty();
  //   $('.login-form').append(`
  //   <div>
  //  <div id="myModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
  //     <div class="modal-dialog" role="document">
  //       <div class="modal-content">
  //         <div class="modal-header">
  //           <h5 class="modal-title">Hej ${this.currentUser.email}!</h5>
  //         </div>
  //         <div class="modal-body">
  //           <p>Du är nu inloggad!</p>
  //         </div>
  //         <div class="modal-footer">
  //          <a class="relocate" href="/">Stäng</a>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  //   `)



  //navbar
  // relocate() {
  //   Store.navbar.userIsLoggedIn = true;
  //   Store.navbar.render();
  //   this.render();
  // }

  async userLogout() {
    let toDeleteUser = await Login.find();
    this.currentLogin = await Login.find();
    await toDeleteUser.delete();
    //   await this.currentUser.delete();
    Store.loggedIn = false;
    Store.navbar.userIsLoggedIn = false;
    Store.navbar.render();
    this.render();
  }


  // validate(){
  //   bghgg
  // }


}

class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
    this.routes = [];
    this.trips = [];
    this.drivers = [];
    this.c = 0;
    this.maxTrips = 2; //TODO: Make sure this works with Driver->Rider Trips the way we want.
    this.tripSpawnInterval = 2000; //ms
    this.intervalId = 0;
    this.initialDrivers = 2;
    this.driverFirstNames = ['Parham', 'Justine', 'David', 'Molly', 'Cedar', 'Jack', 'Rachel', 'Adrian', 'Cheryl', 'Ricky'];
    this.driverLastNames = ['Parvizi', 'Wang', 'Nielsen', 'LeCompte', 'Mora', 'Emrich', 'Agnic', 'Smith', 'Wilson', 'Bobby'];
    this.eventDisplay = false;
    this.allNames = ['Parham', 'Molly', 'David', 'Justine', 'Adrian', 'Kody', 'Lucy', 'Allison', 'Ricky', 'Lucky'];
    this.tempNames = [];
    this.activeDrivers = [];
  }

  initialize() {
    if (this.intervalId !== 0) {
      console.log(`Stopping: ${this.intervalId}`);
      clearInterval(this.intervalId);
    }
    let myThis = this;
    this.intervalId = setInterval(function() {
      myThis.addTrip();
    }, this.tripSpawnInterval);
  }

  initDriverPool() {
    this.tempNames = this.allNames.map(x => x);
    for (let i = 0; i < this.initialDrivers; i++) {
      let newDriver = new Driver();
      // newDriver.name = `${this.driverFirstNames[Math.floor(Math.random() * this.driverFirstNames.length)]} ${this.driverLastNames[Math.floor(Math.random() * this.driverLastNames.length)]}`;
      newDriver.name = this.tempNames[0];
      this.tempNames.splice(0, 1);
      newDriver.initClient();
      this.drivers.push(newDriver);
    };
    this.activeDrivers = this.drivers.map(x => x);
  }

  addDriver() {
    //NOTE: This is a dummy method designed to be called by the Driver Population controls
    //console.log('+1 driver...');
    let newDriver = new Driver();
    newDriver.initClient();
    this.drivers.push(newDriver);
    //TODO: Add this Driver to the map as a Symbol layer
  }

  modifyDriverSpeed(name, modifier) {
    // Called by the createSpeedControlCard function in interface when a user adjusts the
    // speed slider for a driver. This method calls the setModifier function for a specified
    // driver to adjust the speed for that driver.

    // param name: driver name
    // param modifier: number (float)
    for (var i=0; i < this.drivers.length; i++) {
        if (name == this.drivers[i].name){
            this.drivers[i].setModifier(modifier);
        }
    };
  }

  removeDriver() {
    console.log('-1 driver...');
    this.drivers.splice(Math.floor(Math.random() * this.drivers.length), 1);
    //TODO: Remove driver's associated Symbol layer from the map.
  }

  toggleEvent() {
    // Will be called by a click event handler in interface.js
    // toggle eventDisplay true or false when its checkbox is clicked
     console.log('toggling event');
     map.trips.forEach(function(trip, idx) {
       trip.Trigger = !trip.Trigger;
     });
  }

  addTrip() {
    if (this.trips.length < this.maxTrips) {
      if (this.activeDrivers.length >= 1) {
        let newTrip = new Trip(this.activeDrivers[this.c]);
        //console.log(this.activeDrivers);
        //console.log(this.c);
        this.activeDrivers[this.c].isHired = true;
        this.activeDrivers.splice(this.c, 1);
        // this.c++;
        //console.log("Got Driver in AddTrip");
        newTrip.Map = this;
        // The Trigger attribute is defaulted to false for a Trip, but we want to
        // set it in response to whether the event checkbox is true or false.
        newTrip.Trigger = this.eventDisplay;
        newTrip.addRoute();
        this.trips.push(newTrip);
        newTrip.animateRoute();
        //TEMP: This should not be here, once we have actual drivers implemented.
        $('#driver-pop').text(map.trips.length);
      } else {
        console.log("NO AVAILABLE DRIVER");
      }
      // if(this.c < (this.initialDrivers - 1)) {
      //   this.c++;
      // }else {
      //   this.c = 0;
      // };
    }
  }

  routeCall() {
    return $.ajax({
      url: 'db/routes',
      dataType: 'json',
      type: 'GET'
    });
  }
  setRoutes() { //use AJAX route response to initialize as Route object and store in array
    let thus = this;
    this.routeCall().then(function(response) {
      for (let i = 0; i < response.length; i++) {
        let newRoute = new Route(response[i][0], response[i][1], JSON.parse(response[i][2]), JSON.parse(response[i][3]), response[i][4], response[i][5], JSON.parse(response[i][6]));
        thus.routes.push(newRoute);
      };
    });
  }
  async setRoutesHelper() { //async helper
    await this.setRoutes();
  }

  async setLocations() {   //method for initializing locations as Points and storing them in Map object, currently not used
    let result = await $.ajax({
      url: 'db/read',
      dataType: 'json'
    });
    for (let i = 0; i < result.length; i++) {
      let location = new Point(result[i][0], result[i][1], result[i][2]);
      this.locations.push(location);
    };
  }
}

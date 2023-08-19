board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-5, 105, 105, -5],
    axis: true,
    grid: false,
    showCopyright: false
  });
  
  
  
  alpha_slider = board.createElement('slider', [
    [10.0, 95.5],
    [20.0, 95.5],
    [1.0, 5.0, 10.0]
  ], {
    name: '&alpha;',
    strokeColor: 'black',
    fillColor: 'black'
  });
  
  aplha_text = board.createElement('text', [10, 92.5, "alpha"], {
    fixed: true
  });
  
  beta_slider = board.createElement('slider', [
    [30.0, 95.5],
    [40.0, 95.5],
    [0.0, 0.75, 1.0]
  ], {
    name: '&beta;',
    strokeColor: 'black',
    fillColor: 'black'
  });
  beta_text = board.createElement('text', [30, 92.5, "beta"], {
    fixed: true
  });
  
  gamma_slider = board.createElement('slider', [
    [50.0, 95.5],
    [60.0, 95.5],
    [0.0, 0.10, 1.0]
  ], {
    name: '&gamma;',
    strokeColor: 'black',
    fillColor: 'black'
  });
  
  gamma_text = board.createElement('text', [50, 92.5, "gamma"], {
    fixed: true
  });
  
  
  mju_slider = board.createElement('slider', [
    [70.0, 95.5],
    [80.0, 95.5],
    [0.0, 0.01, 1.0]
  ], {
    name: '&#956',
    strokeColor: 'black',
    fillColor: 'black'
  });
  
  mju_text = board.createElement('text', [70, 92.5, "mju"], {
    fixed: true
  });
  
  startSusceptible = board.createElement('glider', [0, 95, board.defaultAxes.y], {
    name: 'Susceptible',
    strokeColor: 'blue',
    fillColor: 'blue'
  });
  startExposed = board.createElement('glider', [0, 0, board.defaultAxes.y], {
    name: 'Exposed',
    strokeColor: 'black',
    fillColor: 'black'
  });
  
  startInfected = board.createElement('glider', [0, 5, board.defaultAxes.y], {
    name: 'Infected',
    strokeColor: 'red',
    fillColor: 'red'
  });
  
  startRecovered = board.createElement('glider', [0, 0, board.defaultAxes.y], {
    name: 'Recovered',
    strokeColor: 'green',
    fillColor: 'green'
  });
  
  var T = 100;
  var N = 100;
  var g3 = null;
  var g4 = null;
  var g5 = null;
  var g6 = null;
  
  
  function solve_ode(x0, I, T, f) {
    var data = [x0];
    var dt = (I[1] - I[0]) / T;
    for (let i = 1; i < T; ++i) {
      var dS_dt = data[i - 1][0] + dt * f(0, data[i - 1])[0];
      var dE_dt = data[i - 1][1] + dt * f(0, data[i - 1])[1];    
      var dI_dt = data[i - 1][2] + dt * f(0, data[i - 1])[2];
      var dR_dt = data[i - 1][3] + dt * f(0, data[i - 1])[3];    
      data.push([dS_dt, dE_dt, dI_dt, dR_dt]);
    }
  
    return data
  }
  
  function ode() {
    var I = [0, 100];
    var T = 1000;
  
    var f = function(t, x) {
      var alpha = alpha_slider.Value();
      var beta = beta_slider.Value();
      var gamma = gamma_slider.Value();
      var mju = mju_slider.Value();
  
      var y = [];
      y[0] = mju * N - mju * x[0] - beta * x[0] * x[1]/N;
      y[1] = beta * x[0] * x[1]/N - (mju + alpha) * x[1];   
      y[2] = alpha * x[1] - (gamma + mju) * x[2]; 
      y[3] = gamma * x[3] - mju * x[3]; 
      
     
      return y;
    };
  
    var x0 = [startSusceptible.Y(), startExposed.Y(), startInfected.Y(), startRecovered.Y()];
  
    var data = solve_ode(x0, I, T, f);
  
    var q = I[0];
    var h = (I[1] - I[0]) / T;
    for (let i = 0; i < data.length; i++) {
      data[i].push(q);
      q += h;
    }
  
    return data;
  }
  
  var data = ode();
  
  var t = [];
  var dataSusceptible = [];
  var dataExposed = [];
  var dataInfected = [];
  var dataRecovered = [];
  for (var i = 0; i < data.length; i++) {
    dataSusceptible[i] = data[i][0];
    dataExposed[i] = data[i][1];
    dataInfected[i] = data[i][2];
    dataRecovered[i] = data[i][3];
    t[i] = data[i][4];
  }
  
  g3 = board.createElement('curve', [t, dataSusceptible], {
    strokeColor: 'blue',
    strokeWidth: '2px'
  });
  g3.updateDataArray = function() {
    var data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
      this.dataX[i] = t[i];
      this.dataY[i] = data[i][0];
    }
  };
  
  
  g4 = board.createElement('curve', [t, dataExposed], {
    strokeColor: 'black',
    strokeWidth: '2px'
  });
  g4.updateDataArray = function() {
    var data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
      this.dataX[i] = t[i];
      this.dataY[i] = data[i][1];
    }
  };
  
  
  g4 = board.createElement('curve', [t, dataInfected], {
    strokeColor: 'red',
    strokeWidth: '2px'
  });
  g4.updateDataArray = function() {
    var data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
      this.dataX[i] = t[i];
      this.dataY[i] = data[i][2];
    }
  };
  
  
  g4 = board.createElement('curve', [t, dataRecovered], {
    strokeColor: 'green',
    strokeWidth: '2px'
  });
  g4.updateDataArray = function() {
    var data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
      this.dataX[i] = t[i];
      this.dataY[i] = data[i][3];
    }
  };
  
board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-5, 105, 105, -5],
    axis: true,
    grid: false,
    showCopyright: false
});

beta_slider = board.createElement('slider', [
    [10.0, 95.5],
    [40.0, 95.9],
    [0.0, 0.75, 1.0]
], {
    name: '&beta;',
    strokeColor: 'black',
    fillColor: 'black'
});

beta_text = board.createElement('text', [10, 92.5, "beta"], {
    fixed: true
});

gamma_slider = board.createElement('slider', [
    [60.0, 95.5],
    [90.0, 95.5],
    [0.0, 0.25, 1.0]
], {
    name: '&gamma;',
    strokeColor: 'black',
    fillColor: 'black'
});

gamma_text = board.createElement('text', [60, 92.5, "gamma"], {
    fixed: true
});

startSusceptible = board.createElement('glider', [0, 95, board.defaultAxes.y], {
    name: 'Susceptible',
    strokeColor: 'blue',
    fillColor: 'blue'
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

let T = 100;
let N = 100;
let g3 = null;
let g4 = null;
let g5 = null;

function solve_ode(x0, I, T, f) {
    let data = [x0];
    let dt = (I[1] - I[0]) / T;
    for (let i = 1; i < T; ++i) {
        let dS_dt = data[i - 1][0] + dt * f(0, data[i - 1])[0];
        let dI_dt = data[i - 1][1] + dt * f(0, data[i - 1])[1];
        let dR_dt = data[i - 1][2] + dt * f(0, data[i - 1])[2];
        data.push([dS_dt, dI_dt, dR_dt]);
    }

    return data
}

function ode() {
    let I = [0, 100];
    let T = 1000;

    let f = function(t, x) {
        let beta = beta_slider.Value();
        let gamma = gamma_slider.Value();

        let y = [];
        y[0] = -beta * x[0] * x[1] / N;
        y[1] = beta * x[0] * x[1] / N - gamma * x[1];
        y[2] = gamma * x[1];

        return y;
    };

    let x0 = [startSusceptible.Y(), startInfected.Y(), startRecovered.Y()];

    let data = solve_ode(x0, I, T, f);

    let q = I[0];
    let h = (I[1] - I[0]) / T;
    for (let i = 0; i < data.length; i++) {
        data[i].push(q);
        q += h;
    }

    return data;
}

let data = ode();

let t = [];
let dataSusceptible = [];
let dataInfected = [];
let dataRecovered = [];

for (let i = 0; i < data.length; i++) {
    dataSusceptible[i] = data[i][0];
    dataInfected[i] = data[i][1];
    dataRecovered[i] = data[i][2];
    t[i] = data[i][3];
}

g3 = board.createElement('curve', [t, dataSusceptible], {
    strokeColor: 'blue',
    strokeWidth: '2px'
});

g3.updateDataArray = function() {
    let data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
        this.dataX[i] = t[i];
        this.dataY[i] = data[i][0];
    }
};

g4 = board.createElement('curve', [t, dataInfected], {
    strokeColor: 'red',
    strokeWidth: '2px'
});

g4.updateDataArray = function() {
    let data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
        this.dataX[i] = t[i];
        this.dataY[i] = data[i][1];
    }
};

g5 = board.createElement('curve', [t, dataRecovered], {
    strokeColor: 'green',
    strokeWidth: '2px'
});

g5.updateDataArray = function() {
    let data = ode();
    this.dataX = [];
    this.dataY = [];
    for (let i = 0; i < data.length; i++) {
        this.dataX[i] = t[i];
        this.dataY[i] = data[i][2];
    }
};

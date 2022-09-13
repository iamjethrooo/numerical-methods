$(document).ready(function() {
    let currentMethod = "bisection";

    let methodButtons = $(".method");
    let methodName = $("#method-name");

    let tableHeaders = ['x<sub>l</sub>', 'x<sub>u</sub>', 'f(x<sub>l</sub>)', 'f(x<sub>u</sub>)', 'x<sub>r</sub>', 'f(x<sub>r</sub>)', 'ε<sub>a</sub>'];
    let results = $("#results");

    let hr = $('<tr></tr>');
    tableHeaders.forEach(e => {
        hr.append($(`<th>${e}</th>`));
    });
    results.append(hr);

    // Function code
    let functionText = $("#function");
    let derivativeText;
    let formula = "";
    let derivative = "";
    functionText.on('input', (ev) => {
        formula = (ev.target.getValue());
    });

    // Navbar buttons action listener
    methodButtons.on("click", (b) => {
        if (b.target.id == currentMethod) return;
        currentMethod = b.target.id;
        methodName.text(b.target.textContent);

        // Clear input div
        $(".input").detach();

        let inputWrapper = $(".input-wrapper");
        if (currentMethod == "bisection" || currentMethod == "false-position") {
            inputWrapper.prepend(`
            <div class="input">
                <div class="function-wrapper">
                    <div class="function">
                        <label for="function">f(x): </label>
                        <math-field id="function"></math-field>
                    </div>
                </div>
            </div>
            <div class="input">
                <div class="interval-wrapper">
                    <div class="interval">
                        <label for="xl">x<sub>l</sub>: </label>
                        <input id="xl" type="text">
                    </div>
                    <div class="interval">
                        <label for="xu">x<sub>u</sub>: </label>
                        <input id="xu" type="text">
                    </div>
                </div>
            </div>
            <div class="input">
                <div class="repetitions-wrapper">
                    <label for="repetitions">Repetitions: </label>
                    <input id="repetitions" type="number" >
                </div>
            </div>`);

            tableHeaders = ['x<sub>l</sub>', 'x<sub>u</sub>', 'f(x<sub>l</sub>)', 'f(x<sub>u</sub>)', 'x<sub>r</sub>', 'f(x<sub>r</sub>)', 'ε<sub>a</sub>'];
        } else if (currentMethod == "fixed-point" || currentMethod == "secant") {
            inputWrapper.prepend(`
                <div class="input">
                    <div class="function-wrapper">
                        <div class="function">
                            <label for="function">f(x): </label>
                            <math-field id="function"></math-field>
                        </div>
                    </div>
                </div>
                <div class="input">
                    <div class="interval-wrapper">
                        <div class="interval">
                            <label for="xi">x<sub>i</sub>: </label>
                            <input id="xi" type="text">
                        </div>
                    </div>
                </div>
                <div class="input">
                    <div class="repetitions-wrapper">
                        <label for="repetitions">Repetitions: </label>
                        <input id="repetitions" type="number" >
                    </div>
                </div>`);
            tableHeaders = ['x<sub>i</sub>', 'ε<sub>a</sub>'];
        } else if (currentMethod == "newton-raphson") {
            inputWrapper.prepend(`
            <div class="input">
                <div class="function-wrapper">
                    <div class="function">
                        <label for="function">f(x): </label>
                        <math-field id="function"></math-field>
                    </div>
                    <div class="function">
                        <label for="derivative">f'(x): </label>
                        <math-field id="derivative"></math-field>
                    </div>
                </div>

            </div>
            <div class="input">
                <div class="interval-wrapper">
                    <div class="interval">
                        <label for="xi">x<sub>i</sub>: </label>
                        <input id="xi" type="text">
                    </div>
                </div>
            </div>
            <div class="input">
                <div class="repetitions-wrapper">
                    <label for="repetitions">Repetitions: </label>
                    <input id="repetitions" type="number" >
                </div>
            </div>`);
            tableHeaders = ['x<sub>i</sub>', 'ε<sub>a</sub>'];
            derivativeText = $("#derivative");
            derivativeText.on('input', (ev) => {
                derivative = (ev.target.getValue());
            });

        } else if (currentMethod == 'muller') {
            inputWrapper.prepend(`
                <div class="input">
                    <div class="function-wrapper">
                        <div class="function">
                            <label for="function">f(x): </label>
                            <math-field id="function"></math-field>
                        </div>
                    </div>
                </div>
                <div class="input">
                    <div class="interval-wrapper">
                        <div class="interval">
                            <label for="x0">x<sub>0</sub>: </label>
                            <input id="x0" type="text">
                        </div>
                        <div class="interval">
                            <label for="x1">x<sub>1</sub>: </label>
                            <input id="x1" type="text">
                        </div>
                        <div class="interval">
                            <label for="x2">x<sub>2</sub>: </label>
                            <input id="x2" type="text">
                        </div>
                    </div>
                </div>
                <div class="input">
                    <div class="repetitions-wrapper">
                        <label for="repetitions">Repetitions: </label>
                        <input id="repetitions" type="number" >
                    </div>
                </div>`);
            tableHeaders = ['i', 'x<sub>0</sub>', 'x<sub>1</sub>', 'x<sub>2</sub>', 'f(x<sub>0</sub>)', 'f(x<sub>1</sub>)', 'f(x<sub>2</sub>)', 'h<sub>0</sub>', 'h<sub>1</sub>', 'd<sub>0</sub>', 'd<sub>1</sub>', 'a', 'b', 'c', 'x<sub>3</sub>', 'ε<sub>a</sub>'];
        }
        
        // Re-add action listener
        functionText = $("#function");
        functionText.on('input', (ev) => {
            formula = (ev.target.getValue());
        });

        results.empty();
        hr = $('<tr></tr>');
        tableHeaders.forEach(e => {
            hr.append($(`<th>${e}</th>`));
        });
        results.append(hr);
    });

    const ce = new ComputeEngine.ComputeEngine();
    ce.numericMode = 'machine';

    MathLive.renderMathInDocument()

    // Hamburger Menu
    let menuToggler = $("#menu-toggler");
    let bar = $(".bar");
    let topNav = $(".top-nav");

    menuToggler.on("click", function() {
        menuToggler.toggleClass("open");
        bar.toggleClass("open");
        topNav.toggleClass("open");
    });

    let calculate = $("#calculate");

    calculate.on("click", () => {
        let iterations = [];

        let repetitions = $("#repetitions").val();
        switch(currentMethod) {
            case "bisection":
                iterations = bisectionMethod(ce, formula, $("#xl").val(), $("#xu").val(), repetitions);
                break;
            case "false-position":
                iterations = falsePositionMethod(ce, formula, $("#xl").val(), $("#xu").val(), repetitions);
                break;
            case "fixed-point":
                iterations = fixedPoint(ce, formula, $("#xi").val(), repetitions);
                break;
            case "newton-raphson":
                iterations = newtonRaphson(ce, formula, derivative, $("#xi").val(), repetitions);
                break;
            case "secant":
                iterations = secant(ce, formula, $("#xi").val(), repetitions);
                break;
            case "muller":
                iterations = muller(ce, formula, [parseFloat($("#x0").val()), parseFloat($("#x1").val()), parseFloat($("#x2").val())], repetitions);
                break;
            default:
                break;
        }
        
        for (let i = 0; i < repetitions; i++) {
            let tr = $('<tr class="table-data"></tr>');
            console.log(iterations);
            iterations[i].forEach(e => {
                let th = $(`<td>${e}</td>`);
                tr.append(th);
            })
    
            results.append(tr);
        }
    });


});

// xli = initial lower bound, xui = initial upper bound
function bisectionMethod(ce, formula, xli, xui, repetitions) {
    let iterations = [];

    // Clear table data
    $(`.table-data`).empty();

    let xl = parseFloat(xli);
    let xu = parseFloat(xui);

    
    let fn = ce.parse(formula);
    fn = fn.subs({x: ce.box(xl)});
    let fxl = fn.machineValue;
    fxl = parseFloat(fxl.toFixed(6));

    fn = ce.parse(formula);
    fn = fn.subs({x: ce.box(xu)});
    let fxu  = fn.machineValue;
    fxu = parseFloat(fxu.toFixed(6));

    let xr = (xl + xu) / 2;
    xr = parseFloat(xr.toFixed(6));

    fn = ce.parse(formula);
    fn = fn.subs({x: ce.box(xr)});
    let fxr = fn.machineValue;
    fxr = parseFloat(fxr.toFixed(6));

    let ea = "100%";

    iterations = [[xl, xu, fxl, fxu, xr, fxr, ea]];
    for (let i = 0; i < repetitions; i++) {
        if (i == 0) continue;
        
        if (fxl * fxr < 0) xu = xr;
        else if (fxl * fxr > 0) xl = xr;
        else if (fxl * fxr == 0) {
            break;
        };

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xl)});
        fxl = fn.machineValue;
        fxl = parseFloat(fxl.toFixed(6));

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xu)});
        fxu  = fn.machineValue;
        fxu = parseFloat(fxu.toFixed(6));

        // xr old
        let xro = xr;

        xr = (xl + xu) / 2;
        xr = parseFloat(xr.toFixed(6));

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xr)});
        fxr = fn.machineValue;
        fxr = parseFloat(fxr.toFixed(6));

        ea = calculateApproximateError(xr, xro);

        iterations.push([xl, xu, fxl, fxu, xr, fxr, ea]);
    }

    return iterations;
}

// xli = initial lower bound, xui = initial upper bound
function falsePositionMethod(ce, formula, xli, xui, repetitions) {
    let iterations = [];

    // Clear table data
    $(`.table-data`).empty();

    let xl = parseFloat(xli);
    let xu = parseFloat(xui);

    
    let fn = ce.parse(formula);
    fn = fn.subs({x: ce.box(xl)});
    let fxl = fn.machineValue;
    fxl = parseFloat(fxl.toFixed(6));

    fn = ce.parse(formula);
    fn = fn.subs({x: ce.box(xu)});
    let fxu  = fn.machineValue;
    fxu = parseFloat(fxu.toFixed(6));

    let xr = xu - ((fxu * (xl - xu)) / (fxl - fxu));
    xr = parseFloat(xr.toFixed(6));

    fn = ce.parse(formula);
    fn = fn.subs({x: ce.box(xr)});
    let fxr = parseFloat(fn.machineValue);
    fxr = parseFloat(fxr.toFixed(6));

    let ea = "100%";

    iterations = [[xl, xu, fxl, fxu, xr, fxr, ea]];
    for (let i = 0; i < repetitions; i++) {
        if (i == 0) continue;
        
        if (fxl * fxr < 0) xu = xr;
        else if (fxl * fxr > 0) xl = xr;
        else if (fxl * fxr == 0) {
            break;
        };

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xl)});
        fxl = parseFloat(fn.machineValue);
        fxl = parseFloat(fxl.toFixed(6));

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xu)});
        fxu = parseFloat(fn.machineValue);
        fxu = parseFloat(fxu.toFixed(6));

        // xr old
        let xro = xr;

        xr = xu - ((fxu * (xl - xu)) / (fxl - fxu));
        xr = parseFloat(xr.toFixed(6));

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xr)});
        fxr = parseFloat(fn.machineValue);
        fxr = parseFloat(fxr.toFixed(6));

        ea = calculateApproximateError(xr, xro);

        iterations.push([xl, xu, fxl, fxu, xr, fxr, ea]);
    }

    return iterations;
}

function fixedPoint(ce, formula, xi, repetitions) {
    let iterations = [];

    // Clear table data
    $(`.table-data`).empty();

    xi = parseFloat(xi);
    
    let ea = "100%";

    iterations = [[xi, ea]];
    for (let i = 0; i < repetitions; i++) {
        if (i == 0) continue;

        // xi old
        let xio = xi;

        let fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xi)});
        xi = parseFloat(fn.machineValue);
        xi = parseFloat(xi.toFixed(6));

        ea = calculateApproximateError(xi, xio);

        iterations.push([xi, ea]);
    }

    return iterations;
}

function newtonRaphson(ce, formula, derivative, xi, repetitions) {
    let iterations = [];

    // Clear table data
    $(`.table-data`).empty();

    xi = parseFloat(xi);

    let ea = "100%";
    iterations = [[xi, ea]];
    for (let i = 0; i < repetitions; i++) {
        if (i == 0) continue;

        let xio = xi;

        let fn = ce.parse(formula);
        fn = fn.subs({x : ce.box(xi)});
        let fxi = parseFloat(fn.machineValue);
        fxi = parseFloat(fxi.toFixed(6));

        fn = ce.parse(derivative);
        fn = fn.subs({x : ce.box(xi)});
        let dxi = parseFloat(fn.machineValue);
        dxi = parseFloat(dxi.toFixed(6));

        xi = xio - (fxi / dxi);

        ea = calculateApproximateError(xi, xio);

        iterations.push([xi, ea]);
    }

    return iterations;
}

function secant(ce, formula, xi, repetitions) {
    let iterations = [];

    // Clear table data
    $(`.table-data`).empty();

    xi = parseFloat(xi);
    let ea = "100%";
    iterations = [[xi, ea]];

    // xi old
    let xio = 0;

    for (let i = 0; i < repetitions; i++) {
        if (i == 0) continue;
        if (i == 1) xio == 0;

        let fn = ce.parse(formula);
        fn = fn.subs({x : ce.box(xi)});
        let fxi = parseFloat(fn.machineValue);
        fxi = parseFloat(fxi.toFixed(6));
    
        fn = ce.parse(formula);
        fn = fn.subs({x : ce.box(xio)});
        let fxio = parseFloat(fn.machineValue);
        fxio = parseFloat(fxio.toFixed(6));
    
        // Temporary xi
        let xit = xi - ((fxi * (xio - xi)) / (fxio - fxi));
        xio = xi;
        xi = parseFloat(xit.toFixed(6));
    
        ea = calculateApproximateError(xi, xio);
    
        iterations.push([xi, ea]);
    }

    return iterations;
}
// $$ x^3-0.5x^2+4x-2 $$
function muller(ce, formula, x, repetitions) {
    let iterations = [];

    // Clear table data
    $(`.table-data`).empty();

    let fn = ce.parse(formula);
    let fx0 = parseFloat(fn.subs({x : ce.box(x[0])}).machineValue);
    let fx1 = parseFloat(fn.subs({x : ce.box(x[1])}).machineValue);
    let fx2 = parseFloat(fn.subs({x : ce.box(x[2])}).machineValue);

    let h0 = parseFloat((x[1] - x[0]).toFixed(6));
    let h1 = parseFloat((x[2] - x[1]).toFixed(6));
    let d0 = parseFloat(((fx1 - fx0) / h0).toFixed(6));
    let d1 = parseFloat(((fx2 - fx1) / h1).toFixed(6));

    let a = parseFloat(((d1 - d0) / (h1 + h0)).toFixed(6));
    let b = parseFloat((a * h1 + d1).toFixed(6));
    let c = fx2;

    let x3 = Math.max(x[2] - ((2 * c) / (b + Math.sqrt(Math.pow(b, 2) - (4 * a * c)))), x[2] - ((2 * c) / (b - Math.sqrt(Math.pow(b, 2) - (4 * a * c)))));
    x3 = parseFloat(x3.toFixed(6));
    let ea = "100%";

    iterations = [[1, x[0], x[1], x[2], fx0, fx1, fx2, h0, h1, d0, d1, a, b, c, x3, ea]];

    for (let i = 0; i < repetitions; i++) {
        if (x[0] < x3 && x[1] > x3) {
            x = [x[0], x3, x[1]];
        } else if (x[1] < x3 && x[2] > x3) {
            x = [x[1], x3, x[2]];
        } else if (x[2] < x3) {
            x = [x[1], x[2], x3];
        } else if (x[0] > x3) {
            x = [x3, x[0], x[1]];
        }

        fx0 = fn.subs({x : ce.box(x[0])}).machineValue;
        fx0 = parseFloat(fx0.toFixed(6));
        fx1 = fn.subs({x : ce.box(x[1])}).machineValue;
        fx1 = parseFloat(fx1.toFixed(6));
        fx2 = fn.subs({x : ce.box(x[2])}).machineValue;
        fx2 = parseFloat(fx2.toFixed(6));

        h0 = parseFloat((x[1] - x[0]).toFixed(6));
        h1 = parseFloat((x[2] - x[1]).toFixed(6));
        d0 = parseFloat(((fx1 - fx0) / h0).toFixed(6));
        d1 = parseFloat(((fx2 - fx1) / h1).toFixed(6));
        a = parseFloat(((d1 - d0) / (h1 + h0)).toFixed(6));
        b = parseFloat((a * h1 + d1).toFixed(6));
        c = fx2;

        let x3o = x3;
        x3 = Math.max(x[2] - ((2 * c) / (b + Math.sqrt(Math.pow(b, 2) - (4 * a * c)))), x[2] - ((2 * c) / (b - Math.sqrt(Math.pow(b, 2) - (4 * a * c)))));
        x3 = parseFloat(x3.toFixed(6));

        ea = calculateApproximateError(x3, x3o);

        iterations.push([i + 2, x[0], x[1], x[2], fx0, fx1, fx2, h0, h1, d0, d1, a, b, c, x3, ea]);
    }

    return iterations;
}

// xr = approximate root, xro = old approximate root
function calculateApproximateError(xr, xro) {
    let e = Math.abs((xr - xro) / xr) * 100;
    e = parseFloat(e.toFixed(4)) + "%";
    return e;
}
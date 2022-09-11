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
    let formula = "";
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
                    <label for="function">f(x): </label>
                    <math-field id="function"></math-field>
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
        } else if (currentMethod == "fixed-point") {
            inputWrapper.prepend(`
                <div class="input">
                    <div class="function-wrapper">
                        <label for="function">f(x): </label>
                        <math-field id="function"></math-field>
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
            default:
                break;
        }
        
        for (let i = 0; i < repetitions; i++) {
            let tr = $('<tr class="table-data"></tr>');
    
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

        ea = Math.abs((xr-xro)/xr) * 100;
        ea = parseFloat(ea.toFixed(4)) + "%";

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
        console.log(fn.machineValue);
        fxr = parseFloat(fn.machineValue);
        console.log(fxr.num);
        fxr = parseFloat(fxr.toFixed(6));


        ea = Math.abs((xr-xro)/xr) * 100;
        ea = parseFloat(ea.toFixed(4)) + "%";

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

        ea = Math.abs((xi-xio)/xi) * 100;
        ea = parseFloat(ea.toFixed(4)) + "%";

        iterations.push([xi, ea]);
    }

    return iterations;
}
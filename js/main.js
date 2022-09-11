$(document).ready(function() {
    const ce = new ComputeEngine.ComputeEngine();
    ce.numericMode = "machine";

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

    // Function code
    let functionWrapper = $(".function-wrapper");
    functionWrapper.append('<math-field id="function"></math-field>');

    let functionText = $("#function");
    let formula = "";
    functionText.on('input', (ev) => {
        formula = (ev.target.getValue());
    })

    // Initial Lower bound and Upper bound
    let xli = $("#xl");
    let xui = $("#xu");

    let calculate = $("#calculate");
    let repetitions = $("#repetitions");
    let results = $("#results");

    let hr = $('<tr></tr>');
    let tableHeaders = ['x<sub>l</sub>', 'x<sub>u</sub>', 'f(x<sub>l</sub>)', 'f(x<sub>u</sub>)', 'x<sub>r</sub>', 'f(x<sub>r</sub>)', 'ε<sub>a</sub>']
    
    tableHeaders.forEach(e => {
        hr.append($(`<th>${e}</th>`));
    });
    results.append(hr);

    calculate.on("click", () => {
        // results.empty();
        $(`#${results.attr("id")} tbody`).empty();

        let xl = parseFloat(xli.val());
        let xu = parseFloat(xui.val());

        
        let fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xl)});
        let fxl = fn.N().json;
        fxl = parseFloat(fxl.toFixed(6));

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xu)});
        let fxu  = fn.N().json;
        fxu = parseFloat(fxu.toFixed(6));

        let xr = (xl + xu) / 2;
        xr = parseFloat(xr.toFixed(6));

        fn = ce.parse(formula);
        fn = fn.subs({x: ce.box(xr)});
        let fxr = fn.N().json;
        fxr = parseFloat(fxr.toFixed(6));

        let ea = 100;

        let iterations = [[xl, xu, fxl, fxu, xr, fxr, ea]];
        for (let i = 0; i < repetitions.val(); i++) {
            if (i == 0) continue;
            
            if (fxl * fxr < 0) xu = xr;
            else if (fxl * fxr > 0) xl = xr;
            else if (fxl * fxr == 0) {
                break;
            };

            fn = ce.parse(formula);
            fn = fn.subs({x: ce.box(xl)});
            fxl = fn.N().json;
            fxl = parseFloat(fxl.toFixed(6));

            fn = ce.parse(formula);
            fn = fn.subs({x: ce.box(xu)});
            fxu  = fn.N().json;
            fxu = parseFloat(fxu.toFixed(6));

            // xr old
            let xro = xr;

            xr = (xl + xu) / 2;
            xr = parseFloat(xr.toFixed(6));

            fn = ce.parse(formula);
            fn = fn.subs({x: ce.box(xr)});
            fxr = fn.N().json;
            fxr = parseFloat(fxr.toFixed(6));

            ea = Math.abs((xr-xro)/xr) * 100;
            ea = parseFloat(ea.toFixed(4));

            iterations.push([xl, xu, fxl, fxu, xr, fxr, ea]);
        }

        for (let i = 0; i < repetitions.val(); i++) {
            let tr = $('<tr></tr>');
    
            iterations[i].forEach(e => {
                let th = $(`<td>${e}</td>`);
                tr.append(th);
            })
    
            results.append(tr);
        }
    });


});
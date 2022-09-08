$(document).ready(function() {
    // Hamburger Menu
    let menuToggler = $("#menu-toggler");
    let bar = $(".bar");
    let topNav = $(".top-nav");

    menuToggler.on("click", function() {
        menuToggler.toggleClass("open");
        bar.toggleClass("open");
        topNav.toggleClass("open");
    })


    let calculate = $(".calculate");
    let repetitions = $(".repetitions");
    let results = $("#results");
    
    let xl = $('td');
    let hr = $('<tr></tr>');
    let tableHeaders = ['x<sub>l</sub>', 'x<sub>u</sub>', 'f(x<sub>l</sub>)', 'f(x<sub>u</sub>)', 'x<sub>r</sub>', 'f(x<sub>r</sub>)', 'ε<sub>a</sub>']
    calculate.on("click", (e) => {
        console.log("hello");
        tableHeaders.forEach(e => {
            //let th = document.createElement('th');
            // th.append(document.createTextNode(e));
            hr.append($(`<th>${e}</th>`));
        });
        results.append(hr);
    
        for (let i = 0; i < 15; i++) {
            let tr = $('<tr></tr>');
    
            tableHeaders.forEach(e => {
                let th = $(`<th>a</th>`);
                // th.append(document.createTextNode(e));
                tr.append(th);
            })
    
            results.append(tr);
        }
    });
});
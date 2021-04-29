window.onload = function(){
  
    var imdb_id = 
        [   'Title',
            'Year',
            'Genre',
            'Runtime',
            'Director',
            'Writer',
            'Actors', 
            'Plot',
            'Ratings',
        ];
    var apiKey = 'api key goes here';

    var locationVal;
    var date;
    
    function generateMovieForm(data){
        console.log(data);
        let container = document.getElementById('showlist');
        container.innerHTML = '';
        //$(container).removeClass("hidden")
        let movieForm = document.createElement('form');
        movieForm.className = 'movieForm';
        container.appendChild(movieForm);
        let movieLogo = document.createElement('div');
        movieLogo.id = 'movieLogo';
        movieForm.appendChild(movieLogo);
        // poster
        let poster = document.createElement('div');
        poster.className = 'field';
        movieForm.appendChild(poster);
        poster.innerHTML = `<img src="${data.Poster}" id="poster"/>`;

        $.each(data, function(key, value) {
            if (imdb_id.includes(key)){
                let field = document.createElement('div');
                field.className = 'field';
                movieForm.appendChild(field);
                if (key === 'Poster'){
                    field.innerHTML = `<img src="${value}" id="poster"/>`;
                } else {
                    let labelHolder = document.createElement('div');
                    labelHolder.className = 'labelHolder';
                    let label = document.createElement('label');
                    label.className = 'label';
                    label.innerText = key + ":";
                    labelHolder.appendChild(label);
                    field.appendChild(labelHolder);
                    if (key === 'Ratings'){
                        let ratingImg = '';
                        let ratingHolder = document.createElement('div');
                        ratingHolder.className = 'inputHolder';
                        for (let i = 0; i < parseInt(value[0].Value[0]); i++){
                            ratingImg += `<img src="./images/trophy.png" id="rating"/>`;
                        }
                        ratingHolder.innerHTML = ratingImg;
                        field.appendChild(ratingHolder);
                    } else {
                        if (key === 'Actors' || key === 'Plot'){
                            let inputHolder = document.createElement('div');
                            inputHolder.className = 'inputHolder';
                            let textArea = document.createElement('textarea');
                            $(textArea).attr('readonly', true);
                            textArea.className = 'textarea';
                            textArea.type = 'text';
                            textArea.value = value;
                            inputHolder.appendChild(textArea);
                            field.appendChild(inputHolder);
                        } else {
                            let inputHolder = document.createElement('div');
                            inputHolder.className = 'inputHolder';
                            let input = document.createElement('input');
                            $(input).attr('readonly', true);
                            input.className = 'input';
                            input.type = 'text';
                            input.value = value;
                            inputHolder.appendChild(input);
                            field.appendChild(inputHolder);
                        }
                    }
                }
            }
        });
    }

    function fetchMovie(id){
        fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
        .then((response) => response.json())
        .then((json) => {
            generateMovieForm(json);
        });
    }

    $(document).on("click", "tr", function(e) {
        fetchMovie(this.id);
    });

    $(document).on("click", ".purchase", function(e) {
        let movieID = this.id;
        let movieTime = $(this).attr('placeholder')
        console.log(movieID);
        console.log(movieTime);

    });

    function display(){
        let tableContainer = document.getElementById('tableHolder');
        tableContainer.innerHTML = ''
        fetch(`showtimes_api?location=${locationVal}&date=${date}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            let table = document.createElement('table');
            table.className = 'table is-narrow';
            table.id = 'table'
            let tbody = document.createElement('tbody');
            tbody.id = 'tbody';
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            let dataLength = data.length;
            let colLength = 2;
            for (let i=0; i < dataLength; i++){
                let row = tbody.insertRow(i);
                row.id = data[i].id;
                for (let j=0; j < colLength; j++){
                    let col = row.insertCell(j)
                    if (j === 0){
                        col.innerText = data[i].title;
                    } else {
                        let times = ''
                        for (let x=0; x < data[i].times.length; x++){
                            times += `<p> ${data[i].times[x]}</p> <form method="POST" action="/buyTickets">
                            <button class="button is-outlined"> 
                            <img src="./images/buy.png"/></button>
                            <input type="text" class="hidden" name="title" value="${data[i].title}"/>
                            <input type="text" class="hidden" name="location" value="${data[i].location}"/>
                            <input type="text" class="hidden" name="date" value="${data[i].date}"/>
                            <input type="text" class="hidden" name="time" value="${data[i].times[x]}"/>
                            </form>`;
                        }
                        col.innerHTML = times;
                    }
                }
                
            }
        });
        

    }

    let submit = document.getElementById('submit-button');
    submit.onclick = function(){
        locationVal = $("#location :selected").val();
        date = document.getElementById('date').value;
        date = date.replaceAll('-','/');
        display();
    };




};

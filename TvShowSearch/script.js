document.querySelector('form').addEventListener('submit', async (event) => {

    document.getElementById("results").innerHTML = "";
    event.preventDefault();

    const input = document.getElementById('query').value;

    try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(input)}`);
        const jsonData = await response.json();
        console.log(jsonData);


        jsonData.forEach(tvShow => {

            const article = document.createElement('article');


            const h2 = document.createElement('h2');
            h2.textContent = tvShow.show.name;
            article.appendChild(h2);


            const a = document.createElement('a');
            a.href = tvShow.show.url;
            a.target = "_blank";
            a.textContent = "Visit the official TVmaze page";
            article.appendChild(a);


            const image = document.createElement('img');
            if (tvShow.show.image) {
                image.src = tvShow.show.image.medium;
            }
            else {
                image.src = 'https://via.placeholder.com/210x295?text=Not%20Found';
            }
            
            image.alt = tvShow.show.name;
            article.appendChild(image);

            const TVsummary = document.createElement('div');
            TVsummary.innerHTML = tvShow.show.summary;
            article.appendChild(TVsummary);

            document.getElementById("results").appendChild(article);


        });


    } catch (error) {
        console.error("Error fetching data:", error);
    }

});
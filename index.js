document.addEventListener("DOMContentLoaded", function () {
    const formSearch = document.getElementById('movie-form');
    const userInput = document.getElementById('user-input');
    const movieCardContainer = document.getElementById('movie-card');
    const totalResult = document.getElementById('total-result')
    const nextpageBtn = document.getElementById('nextpage-btn')
    const prevpageBtn = document.getElementById('prevpage-btn')
    const currentPage = document.getElementById('current-page')
    let movieArray = JSON.parse(localStorage.getItem("watchlist")) || []
    let count = 1
    let query = ""

    formSearch.addEventListener('submit', function (e) {
        e.preventDefault();
        count = 1
        let result = userInput.value.trim();
        query = result
        if (!result) return; // Prevent empty searches
        fetchMovies(query, count)
        currentPage.textContent = `Current page: ${count} `
        console.log(count)


    });

    function fetchMovies(result, count) {
        fetch(`https://www.omdbapi.com/?s=${result}&page=${count}&apikey=7986ceb5`)
            .then(res => res.json())
            .then(data => {

                if (data.totalResults > 0) {
                    totalResult.textContent = `Total Result: ${data.totalResults}`
                    const maxPages = Math.ceil(data.totalResults / 10);
                    if (count >= maxPages) {
                        nextpageBtn.style.display = "none";
                    } else {
                        nextpageBtn.style.display = "block"
                    }

                }

                if (!data.Search) {
                    movieCardContainer.innerHTML = "<p>No movies found.</p>";
                    return;
                }

                movieCardContainer.innerHTML = ""; // Clear previous results

                let movieIds = data.Search.map(movie => movie.imdbID);

                movieIds.forEach(id => {
                    fetch(`https://www.omdbapi.com/?i=${id}&apikey=7986ceb5`)
                        .then(res => res.json())
                        .then(movie => {
                            movieCardContainer.innerHTML += `
                    <div id="movie-card" class="movie-card">
                        <div class="movie-item">
                            <div class="poster">
                                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}" />
                            </div>
                            <div class="movie-info">
                                <div>
                                    <span class="title">${movie.Title}</span>
                                    <span class="rating">⭐ ${movie.imdbRating || "N/A"}</span>
                                </div>
                                <div class="details">${movie.Runtime} · ${movie.Genre}</div>
                                <button class="watchlist-btn" data-id = "${movie.imdbID}"
                                data-title ="${movie.Title}" data-poster = "${movie.Poster}" data-rating = "${movie.imdbRating || "NA"}"
                                data-runtime ="${movie.Runtime}"  data-genre = "${movie.Genre}" data-plot = "${movie.Plot}">
                                + Watchlist
                                </button>
                                <p class="description">${movie.Plot}</p>
                            </div>
                        </div>
                         </div>`;

                        });
                });
            })
            .catch(error => console.error("Error fetching data:", error));

    }

    document.addEventListener('click', function (e) {

        if (e.target.classList.contains('watchlist-btn')) {
            const dataID = e.target.getAttribute("data-id");
            const dataTitle = e.target.getAttribute('data-title');
            const dataPoster = e.target.getAttribute('data-poster');
            const dataRating = e.target.getAttribute('data-rating');
            const dataRuntime = e.target.getAttribute('data-runtime');
            const dataGenre = e.target.getAttribute('data-genre');
            const dataPlot = e.target.getAttribute('data-plot');

            const movieObj = {
                id: dataID,
                title: dataTitle,
                poster: dataPoster,
                rating: dataRating,
                runtime: dataRuntime,
                genre: dataGenre,
                plot: dataPlot
            }

            const isAlreadyAdded = movieArray.some(movie => movie.id === dataID);

            if (!isAlreadyAdded) {
                movieArray.push(movieObj)
                alert(`${movieObj.title} added to Watchlist!`);
                localStorage.setItem('watchlist', JSON.stringify(movieArray))

            } else {
                alert(`${movieObj.title} is already in the Watchlist.`);
            }
        }
    })

    nextpageBtn.addEventListener('click', function (e) {
        e.preventDefault()
        count += 1
        if (count > 1) {
            prevpageBtn.style.display = 'block'
        } else {
            prevpageBtn.style.display = 'none'
        }
        fetchMovies(query, count)
        setTimeout(currentPage.textContent = `Current page: ${count} `, 3000)
        console.log(`nextbutton:${count}`)

    })
    prevpageBtn.addEventListener('click', function (e) {
        e.preventDefault()
        count -= 1
        if (count > 1) {
            prevpageBtn.style.display = 'block'
        } else {
            prevpageBtn.style.display = 'none'
        }
        setTimeout(currentPage.textContent = `Current page: ${count} `, 3000)
        fetchMovies(query, count)
        console.log(`prevbutton:${count}`)
    })


})
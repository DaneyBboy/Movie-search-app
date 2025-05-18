let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let renderHtml = "";

console.log(watchlist);
if (watchlist.length > 0) {
  document.querySelector("h3").style.display = "none";
  document.querySelector("h4").style.display = "none";
  render();
}

function render() {
  renderHtml = watchlist
    .map(
      (item) =>
        `<div id="movie-card" class="movie-card">
            <div class="movie-item">
                <div class="poster">
                    <img src="${item.poster !== "N/A" ? item.poster : "placeholder.jpg"}"  />
                </div>
                    <div class="movie-info">
                                    <div>
                                        <span class="title">${item.title}</span>
                                        <span class="rating">⭐ ${item.rating || "N/A"}</span>
                                    </div>
                                    <div class="details">${item.runtime} · ${item.genre}
                                    </div>
                                    <button class="watchlist-btn" data-id="${item.id}">
                                    - Remove
                                    </button>
                                    <p class="description">${item.plot}</p>
                                </div>
                            </div>
                        </div>`
    )
    .join("");

  const watchlistContainer = document.getElementById("default-watchlist");
  if (watchlistContainer) {
    watchlistContainer.innerHTML = renderHtml;
  }
  return renderHtml;
}

document.addEventListener('click', function(e){
    if(e.target.classList.contains('watchlist-btn')){
        const dataID = e.target.getAttribute("data-id");
        updatedWatchlist = watchlist.filter(item => item.id !== dataID);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist))
        watchlist = updatedWatchlist
        location.reload();
        render() 
    }

})

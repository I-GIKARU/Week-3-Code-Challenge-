document.addEventListener("DOMContentLoaded", () => {
  fetchFilms();
});

const BASE_URL = "http://localhost:3000";
const filmsList = document.getElementById("films");
const buyTicketBtn = document.getElementById("buy-ticket");

function fetchFilms() {
  fetch(`${BASE_URL}/films`)
    .then(res => res.json())
    .then(films => {
      films.forEach(film => {
        const li = document.createElement("li");
        li.textContent = film.title;
        li.classList.add("film-item");

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteFilm(film.id);
        });

        li.appendChild(deleteBtn);
        li.addEventListener("click", () => showFilmDetails(film));

        filmsList.appendChild(li);
      });

      if (films.length > 0) {
        showFilmDetails(films[0]);
      }
    })
    .catch(err => console.log("Error loading films:", err));
}

function showFilmDetails(film) {
  document.getElementById("film-title").textContent = film.title;
  document.getElementById("poster").src = film.poster;
  document.getElementById("runtime").textContent = `Runtime: ${film.runtime} mins`;
  document.getElementById("description").textContent = film.description;
  document.getElementById("showtime").textContent = `Showtime: ${film.showtime}`;

  let availableTickets = film.capacity - film.tickets_sold;
  document.getElementById("ticket-info").textContent = `Tickets Left: ${availableTickets}`;

  buyTicketBtn.disabled = availableTickets <= 0;
  buyTicketBtn.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";

  buyTicketBtn.onclick = () => buyTicket(film);
}

function buyTicket(film) {
  if (film.tickets_sold >= film.capacity) return;

  film.tickets_sold += 1;
  showFilmDetails(film);

  fetch(`${BASE_URL}/films/${film.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickets_sold: film.tickets_sold })
  });
}
//delete film

function deleteFilm(filmId) {
  fetch(`${BASE_URL}/films/${filmId}`, {
    method: "DELETE"
  }).then(() => {
    document.getElementById("films").innerHTML = "";
    fetchFilms();
  });
}

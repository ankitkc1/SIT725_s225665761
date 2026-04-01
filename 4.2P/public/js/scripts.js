const clickMe = () => {
  M.toast({ html: "Welcome to Plant Care Hub!" });
};

const submitForm = () => {
  const formData = {
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    email: $("#email").val(),
    favourite_plant: $("#favourite_plant").val()
  };

  console.log("Form Data Submitted:", formData);

  M.toast({ html: "Thanks! Your suggestion has been submitted." });

  document.getElementById("plantForm").reset();
  M.updateTextFields();

  const modalInstance = M.Modal.getInstance(document.getElementById("modal1"));
  modalInstance.close();
};

const addCards = (items) => {
  items.forEach((item) => {
    const itemToAppend = `
      <div class="col s12 m6 l3">
        <div class="card medium hoverable">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${item.image}" alt="${item.title}">
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              ${item.title}
              <i class="material-icons right">more_vert</i>
            </span>
            <p><a href="#!">${item.link}</a></p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              ${item.title}
              <i class="material-icons right">close</i>
            </span>
            <p class="card-text">${item.description}</p>
          </div>
        </div>
      </div>
    `;

    $("#card-section").append(itemToAppend);
  });
};

const getPlants = () => {
  $.get("/api/plants", (response) => {
    if (response.statusCode === 200) {
      addCards(response.data);
    } else {
      M.toast({ html: "Unable to load plant data." });
    }
  }).fail(() => {
    M.toast({ html: "Server error while fetching plant data." });
  });
};

$(document).ready(() => {
  $(".materialboxed").materialbox();
  $(".modal").modal();

  $("#clickMeButton").click(() => {
    clickMe();
  });

  $("#formSubmit").click(() => {
    submitForm();
  });

  getPlants();
});
let emailAddBtn = document.querySelector("#more-email");
let phoneAddBtn = document.querySelector("#more-phone");

let newContactForm = document.querySelector("#new-contact");
let editContactForm = document.querySelector("#edit-contact");
let searchInput = document.querySelector("#contact-search");
let searchTimer;
let searchResult = document.querySelector("#main-table > tbody.search-result");
let defaultResult = document.querySelector(
  "#main-table > tbody.default-result"
);

let exportBtn = document.querySelector("#export-btn");

// function for save data to xls
const exportExcel = (data, workSheetName, filePath) => {
  const workBook = XLSX.utils.book_new();
  const workSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
  XLSX.writeFile(workBook, filePath);
};

// template function for show search result
const searchResultTemplate = (serial, id, name, emails, phones) => {
  let email = "";
  let phone = "";
  if (emails.length > 1) {
    emails.map((mail) => {
      email += `<tr><td><a href="mailto:${mail}">${mail}</a></td></tr>`;
    });
  } else
    email = `<tr><td><a href="mailto:${emails[0]}">${emails[0]}</a></td></tr>`;
  if (phones.length > 1) {
    phones.map((phn) => {
      phone += `<tr><td><a href="tel:${phn}">${phn}</a></td></tr>`;
    });
  } else
    phone = `<tr><td><a href="tel:${phones[0]}">${phones[0]}</a></td></tr>`;

  return `
          <tr>
            <td>${serial}</td>
            <td>${name}</td>
            <td>
              <table>
                ${email}
              </table>
            </td>
            <td>
              <table>
                ${phone}
              </table>
            </td>
            <td>
              <button
                class="btn btn-warning search-edit-btn"
                data-toggle="modal"
                data-target="#editModal"
                data-name="${name}"
                data-email="${emails}"
                data-phone="${phones}"
                data-id="${id}"
              >
                edit
              </button>
            </td>
            <td>
              <a href="/contact/delete/${id}" class="btn btn-danger"
                >Delete</a
              >
            </td>
          </tr>`;
};

// template function for add new input field
const inter = (name, btn) => {
  let i = 0;
  btn.onclick = () => {
    i++;
    if (i >= 2) {
      btn.classList.add("d-none");
    }
    btn.insertAdjacentHTML(
      "beforebegin",
      `<input type="text" class="form-control mb-2" name="${name}" placeholder="${name}"/>`
    );
  };
};
inter("email", emailAddBtn); // call function for email inputs
inter("phone", phoneAddBtn); // call function for phone inputs

// starts search functions

// input event listener
searchInput.addEventListener("keyup", () => {
  clearTimeout(searchTimer);

  if (searchInput.value) {
    searchTimer = setTimeout(searchUser, 500); // search after .5s type delay
  } else {
    defaultResult.classList.remove("d-none");
    searchResult.innerHTML = "";
    searchResult.classList.add("d-none");
    document.querySelector("#search-error").textContent = "";
  }
});
// clear the timeout while typing
searchInput.addEventListener("keydown", () => {
  clearTimeout(searchTimer);
});

// fucntion call user find api
async function searchUser() {
  try {
    let response = await fetch(`/contact/search/${searchInput.value}`, {
      method: "POST",
    });
    let result = await response.json();

    if (result.length > 0) {
      document.querySelector("#search-error").textContent = "";
      defaultResult.classList.add("d-none");
      searchResult.classList.remove("d-none");
      let i = 0;
      result.forEach((info) => {
        i++;
        searchResult.innerHTML += searchResultTemplate(
          i,
          info._id,
          info.name,
          info.email,
          info.phone
        ); // template function for show found contact
      });
      document.querySelectorAll(".search-edit-btn").forEach((btn) => {
        btn.onclick = () => {
          document
            .querySelectorAll(".invalid-feedback")
            .forEach((e) => (e.innerHTML = ""));
          editContactForm[0].value = btn.dataset.name;
          editContactForm[1].value = btn.dataset.email;
          editContactForm[2].value = btn.dataset.phone;
          editContactForm[3].value = btn.dataset.id;
        };
      });
    } else {
      document.querySelector("#search-error").textContent = "no contact found"; // section title
    }
  } catch (err) {
    console.log(err);
  }
}
// search end

// add new contact
newContactForm.onsubmit = async function (e) {
  try {
    e.preventDefault();

    document
      .querySelectorAll(".invalid-feedback")
      .forEach((e) => (e.innerHTML = ""));

    let formData = new URLSearchParams(new FormData(this));

    let response = await fetch(this.action, {
      method: this.method,
      body: formData,
    });

    let result = await response.json();

    if (result.error) {
      Object.keys(result.error).forEach((fieldName) => {
        // getting error message field for show message
        const errFields = document.querySelector(`#${fieldName}-error`);
        errFields.innerHTML = result.error[fieldName].msg;
      });
    } else {
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

// for edit functionality
document.querySelectorAll(".edit-btn").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".invalid-feedback")
      .forEach((e) => (e.innerHTML = ""));
    editContactForm[0].value = btn.dataset.name;
    editContactForm[1].value = btn.dataset.email;
    editContactForm[2].value = btn.dataset.phone;
    editContactForm[3].value = btn.dataset.id;
  };
});
// submit edit
editContactForm.onsubmit = async (e) => {
  try {
    e.preventDefault();

    document
      .querySelectorAll(".invalid-feedback")
      .forEach((e) => (e.innerHTML = ""));

    let formData = new URLSearchParams(new FormData(editContactForm));
    let response = await fetch("/contact/edit", {
      method: "POST",
      body: formData,
    });

    let result = await response.json();
    if (result.error) {
      Object.keys(result.error).forEach((fieldName) => {
        // getting error message field for show message
        const errFields = document.querySelector(`#${fieldName}-error`);
        errFields.innerHTML = result.error[fieldName].msg;
      });
    } else {
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (error) {
    console.error(error);
  }
};

// function for export contacts to xls file
exportBtn.onclick = async () => {
  try {
    let response = await fetch("/contact/export", { method: "GET" });
    let result = await response.json();
    if (result.err) alert(result.err);
    exportExcel(result, "list", "contacts.xls");
  } catch (error) {
    console.log(error);
  }
};

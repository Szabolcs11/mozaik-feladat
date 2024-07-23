$(document).ready(function () {
  // 1. Lépés
  $("#newColletionBtn").click(function () {
    $("#collectionForm").toggleClass("d-none");
  });

  $("#saveCollectionBtn").click(function () {
    const title = $("#collectionTitle").val();
    const topic = $("#collectionTopic").val();
    const date = $("#collectionDate").val();
    const imageFile = $("#collectionImg")[0]?.files[0];
    if (title && topic && date && imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        const collectionItem = `<li class="list-group-item main-list position-relative" data-id="${title}">
                      <span class="collection-title fw-bold">${title}</span>
                      <button class="btn btn-warning btn-sm rename-item-btn ml-2">Átnevezés</button>
                      <br/>
                      <span class="collection-topic">${topic}</span>
                      <img src="${imageUrl}" alt="Kép" class="collection-imag float-end w-25">
                      <br/>
                      <span class="collection-date">${date}</span>
                      <div class="rename-form mt-2" style="display: none;">
                          <input type="text" class="form-control new-title" placeholder="Új cím">
                          <button class="btn btn-success btn-sm save-title-btn mt-2">Mentés</button>
                      </div>
                      <div class="new-item-form mt-2" style="display: none;">
                          <input type="text" class="form-control new-item-title" placeholder="Elem címe">
                          <button class="btn btn-success btn-sm save-item-btn mt-2">Elem hozzáadása</button>
                      </div>
                      <br/>
                      <button class="btn btn-info btn-sm add-item-btn ml-2 mt-2 mb-2">Elem hozzáadása</button>
                      <button class="btn btn-danger btn-sm ml-2 mt-2 mb-2 delete-selected-items-btn d-none">Kijelölt elemek törlése</button>
                      <ul class="item-list list-group mt-2"></ul>
                  </li>`;
        $("#collectionList").append(collectionItem);
        $("#collectionForm").toggleClass("d-none");
        $("#collectionTitle").val("");
        $("#collectionTopic").val("");
        $("#collectionDate").val("");
        $("#collectionImg").val("");
      };
      reader.readAsDataURL(imageFile);
    } else {
      alert("Töltsd ki az összes mezőt!");
    }
  });

  $(document).on("click", ".rename-item-btn", function () {
    const newTitle = prompt("Új cím:");
    if (newTitle) {
      $(this).siblings(".collection-title").text(newTitle);
      $(this).parent(".list-group-item").attr("data-id", newTitle);
    }
  });

  // 2. Lépés
  $(document).on("click", ".add-item-btn", function () {
    $(this).siblings(".new-item-form").toggle();
  });

  $(document).on("click", ".save-item-btn", function () {
    let title = $(this).siblings(".new-item-title").val();
    if (title) {
      let item = `
                  <li class="list-group-item">
                      <input type="checkbox" class="item-checkbox">
                      <span class="item-title">${title}</span>
                      <span class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                          <ul class="dropdown-menu">
                              <li><a class="dropdown-item move-item" href="#">Áthelyezés</a></li>
                              <li><a class="dropdown-item rename-item" href="#">Átnevezés</a></li>
                              <li><a class="dropdown-item delete-item" href="#">Törlés</a></li>
                          </ul>
                      </span>
                      <div class="rename-item-form mt-2" style="display: none;">
                          <input type="text" class="form-control new-item-title" placeholder="Új cím">
                          <button class="btn btn-success btn-sm save-item-title-btn mt-1">Mentés</button>
                      </div>
                  </li>
              `;
      $(this).closest(".list-group-item").find(".item-list").append(item);
      $(this).siblings(".new-item-title").val("");
      $(this).parent().hide();
    } else {
      alert("Add meg a címet!");
    }
  });

  // 3., 4. Lépés
  $(document).on("click", ".dropdown-item", function () {
    const action = $(this).attr("class").split(" ")[1];
    const itemElement = $(this).closest(".list-group-item");
    switch (action) {
      case "move-item":
        const targetCollectionId = prompt("Add meg a gyűjtemény nevét");
        if (targetCollectionId) {
          const targetCollection = $(`li[data-id=${targetCollectionId}] .item-list`);
          if (targetCollection.length) {
            targetCollection.append(itemElement);
          } else {
            alert("Érvénytelen gyűjtemény név!");
          }
        }
        break;
      case "rename-item":
        itemElement.find(".rename-item-form").toggle();
        break;
      case "delete-item":
        itemElement.remove();
        break;
    }
  });

  $(document).on("click", ".save-item-title-btn", function () {
    const newItemTitle = $(this).siblings(".new-item-title").val();
    if (newItemTitle) {
      $(this).closest(".list-group-item").find(".item-title").text(newItemTitle);
      $(this).parent().hide();
    } else {
      alert("Add meg az új címet!");
    }
  });

  $(document).on("change", ".item-checkbox", function () {
    const parentCollectionItem = $(this).closest(".main-list");
    const checkedCount = parentCollectionItem.find(".item-checkbox:checked").length;
    if (checkedCount >= 1) {
      parentCollectionItem.find(".delete-selected-items-btn").removeClass("d-none");
    } else {
      parentCollectionItem.find(".delete-selected-items-btn").addClass("d-none");
    }
  });

  $(document).on("click", ".delete-selected-items-btn", function () {
    const parentCollectionItem = $(this).closest(".list-group-item");
    parentCollectionItem.find(".item-checkbox:checked").each(function () {
      $(this).closest(".list-group-item").remove();
    });
    $(this).addClass("d-none");

    if (parentCollectionItem.find(".item-checkbox").length == 0) {
      $(this).addClass("d-none");
    }
  });
});

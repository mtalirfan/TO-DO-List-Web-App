import TodoList from "./todolist.js";
import TodoItem from "./todoitem.js";

const todoList = new TodoList();

// Launch App
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  const itemEntryForm = document.getElementById("itemEntryForm");

  itemEntryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processSubmission();
  });

  const clearItems = document.getElementById("clearItems");
  const list = todoList.getList();

  clearItems.addEventListener("click", (event) => {
    if (list.length) {
      const confirmed = confirm(
        "Are you sure you want to clear the entire list?"
      );
      if (confirmed) {
        todoList.clearList();
        updatePersistentData(todoList.getList());
        refreshThePage();
      }
    }
  });

  loadlistObject();
  refreshThePage();
};

const loadlistObject = () => {
  const storedlist = localStorage.getItem("todoList");
  if (typeof storedlist !== "string") return;
  const parsedlist = JSON.parse(storedlist);
  parsedlist.forEach((itemObj) => {
    const newTodoItem = createNewItem(itemObj._id, itemObj._item);
    todoList.addToList(newTodoItem);
  });
};

const refreshThePage = () => {
  clearListDisplay();
  renderList();
  clearItemEntryField();
  setFocusOnItemEntry();
};

const clearListDisplay = () => {
  const parentElement = document.getElementById("listItems");
  deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const renderList = () => {
  const list = todoList.getList();
  list.forEach((item) => {
    buildListItem(item);
  });
};

const buildListItem = (item) => {
  const div = document.createElement("div");
  div.className = "item";
  const check = document.createElement("input");
  check.type = "checkbox";
  check.id = item.getId();
  check.tabIndex = 0;
  addClickListenerToCheckbox(check);
  const label = document.createElement("label");
  label.htmlFor = item.getId();
  label.textContent = item.getItem();
  div.appendChild(check);
  div.appendChild(label);
  const container = document.getElementById("listItems");
  container.appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
  checkbox.addEventListener("click", (event) => {
    todoList.removeFromList(checkbox.id);
    updatePersistentData(todoList.getList());
    // const removedText = getLabelText(checkbox.id);
    updateScreenReaderConfirmation(
      checkbox.nextSibling.textContent,
      "removed from list"
    );
    setTimeout(() => {
      refreshThePage();
    }, 1000);
  });
};

// const getLabelText = (checkboxId) => {
//   return document.getElementById(checkboxId).nextSibling.textContent;
// };

const updatePersistentData = (listArray) => {
  localStorage.setItem("todoList", JSON.stringify(listArray));
};

const clearItemEntryField = () => {
  document.getElementById("newItem").value = "";
};

const setFocusOnItemEntry = () => {
  document.getElementById("newItem").focus();
};

const processSubmission = () => {
  const newEntryText = getNewEntry();
  if (!newEntryText.length) return;
  const nextItemId = calcNextItemId();
  const todoItem = createNewItem(nextItemId, newEntryText);
  todoList.addToList(todoItem);
  updatePersistentData(todoList.getList());
  updateScreenReaderConfirmation(todoItem.getItem(), "added");
  refreshThePage();
};

const getNewEntry = () => {
  return document.getElementById("newItem").value.trim();
};

const calcNextItemId = () => {
  let nextItemId = 1;
  const list = todoList.getList();
  if (list.length > 0) {
    nextItemId = list[list.length - 1].getId() + 1;
  }
  return nextItemId;
};

const createNewItem = (itemId, itemText) => {
  const todo = new TodoItem();
  todo.setId(itemId);
  todo.setItem(itemText);
  return todo;
};

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
  document.getElementById(
    "confirmation"
  ).textContent = `${newEntryText} ${actionVerb}.`;
};

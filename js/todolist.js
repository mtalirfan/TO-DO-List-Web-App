export default class TodoList {
  constructor() {
    this.todoList = [];
  }

  getList() {
    return this.todoList;
  }

  clearList() {
    this.todoList = [];
  }

  addToList(todo) {
    this.todoList.push(todo);
  }

  removeFromList(todo) {
    const list = this.todoList;
    for (let i = 0; i < list.length; i++) {
      if (list[i]._id == todo) {
        list.splice(i, 1);
        break;
      }
    }
  }
}

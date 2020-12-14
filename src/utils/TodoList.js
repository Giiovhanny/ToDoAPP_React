import _ from "lodash";
import axios from 'axios';
import { Component } from "react";


export default class TodoList extends Component {
  constructor(storagekey) {
    super();
    this.storagekey = storagekey;
    this.load();
    
    
  };
  state={
    tasks: [],
  };

  componentDidMount(){
    axios.get(`http://localhost:4000/get-all-tasks`)
    .then(res => {
      const tasks = res.data;
      this.setState({ tasks });
    })
  }


  load() {
    
    const data = window.localStorage.getItem(this.storagekey);
   
    let data2 =  axios.get(`http://localhost:4000/get-all-tasks`);

    
console.log(this.state.tasks);

  

    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  saveinDB(item) {

    axios
      .post("http://localhost:4000/add-task",item)
      .then(res => console.log(res))
      .catch(err => console.log(err));
   

  }

  save() {
    window.localStorage.setItem(this.storagekey, JSON.stringify(this.items));

  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  add(name) {
    const item = {
      id: this.newId(),
      name,
      completed: false,
      createdat: Date.now(),
    };
    this.items.unshift(item);
    this.saveinDB(item);
    this.save();
  }

  delete(todo) {
    this.items = this.items.filter(item => item.id != todo.id);
    this.save();
  }

  toggle(todo) {
    let item = _.find(this.items, it => it.id == todo.id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  move(itemId, beforeId) {
    const itemIndex = this.items.findIndex(item => item.id == itemId);
    const beforeIndex = this.items.findIndex(item => item.id == beforeId);
    const item = this.items.splice(itemIndex, 1)[0];
    this.items.splice(beforeIndex, 0, item);
  }

  filter(status) {
    switch (status) {
      case "active":
        return this.items.filter(item => item.completed == false);
      case "completed":
        return this.items.filter(item => item.completed == true);
      case "all":
      default:
        return this.items;
    }
  }
}

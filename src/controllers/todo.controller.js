import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const {title, completed, priority, tags, dueDate} = req.body;

    if(!title || title.trim().length ===  0){
      return res.status(400).json({error: {message: "title is required"}});
    }

    const todoPayload = {
      title: title.trim(),
    };

    if(completed !== undefined) todoPayload.completed = completed;
    if(priority !== undefined) todoPayload.priority = priority;
    if(tags !== undefined) todoPayload.tags = Array.isArray(tags) ? tags : [];
    if(dueDate !== undefined) todoPayload.dueDate = dueDate;

    const todo = await Todo.create(todoPayload);

    return res.status(201).json(todo);
  } 
  catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    let {page, limit, completed, priority, search} = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = {};

    if(completed !== undefined){
      query.completed = completed;
    }

    if(priority){
      query.priority = priority;
    }

    if(search){
      query.title = {$regex: search, $options: 'i'}
    }

    //ek bar me jitna limit hai utna hi todo aayega
    const todo = await Todo.find(query)
    .sort({createdAt: -1})
    .skip((page - 1) * limit)
    .limit(limit);
    // agar limit=10 hai to 50 todo ke liye 5 request aayega frontend se one by one

    //ye btata hai filter lagane ke baad kitne todos aaye hai
    const total = await Todo.countDocuments(query);
    const pages = Math.ceil(total / limit);


    res.status(200).json({data: [...todo], meta: {total, page, limit, pages}})
  } 
  catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const {id} = req.params;

    const todo = await Todo.findById(id);
    if(!todo){
      return res.status(404).json({error: {message: "todo not found"}})
    }

    return res.send(todo);
  } 
  catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const {id} = req.params;
    const {title, completed, priority, tags, dueDate} = req.body;

    const updatedPayload = {};

    if(title && title.trim().length > 0){
      updatedPayload.title = title.trim();
    }
    if(completed !== undefined){
      updatedPayload.completed = completed;
    }
    if(priority !== 'undefined'){
      updatedPayload.priority = priority;
    }
    if(tags !== undefined){
      updatedPayload.tags = tags;
    }
    if(dueDate !== undefined){
      updatedPayload.dueDate = dueDate;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, updatedPayload,
    {new: true, runValidators: true});

    if(!updatedTodo){
      return res.status(404).json({error: {message: "todo not found"}})
    }

    res.status(200).send(updatedTodo);
  } 
  catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const {id} = req.params;

    const todo = await Todo.findById(id);

    if(!todo){
      return res.status(404).json({error: {message: "todo not found"}})
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).send(todo);
  } 
  catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const {id} = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if(!todo){
      return res.status(404).json({error: {message: "todo not found"}})
    }

    return res.status(204).send();
  } 
  catch (error) {
    next(error);
  }
}

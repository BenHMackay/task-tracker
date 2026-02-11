package com.alfex.TaskTracker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
public class TaskController {

    // Inject task repository for database access
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Retrieve all tasks
    @GetMapping("/tasks")
    public List<Task> getAllTasks(
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Boolean completed) {
        if (priority != null) {
            return taskService.getTasksByPriority(priority);
        } else if (completed != null) {
            return taskService.getTasksByCompleted(completed);
        } else {
            return taskService.getAllTasks();
        }
    }

    // Create tasks and add ID
    @PostMapping("/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@Valid @RequestBody Task task) {
        return taskService.createTask(task);
    }

    // Retrieve single task based on Id
    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // Update task completed
    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody Task updatedTask) {
        return taskService.updateTask(id, updatedTask);
    }

    // Delete tasks
    @DeleteMapping("/tasks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

}
package com.alfex.TaskTracker;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(Long id) {
        super("Error: Task not found with id: " + id);
    }
}
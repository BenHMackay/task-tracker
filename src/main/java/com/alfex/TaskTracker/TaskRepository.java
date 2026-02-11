package com.alfex.TaskTracker;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByPriority(Priority priority);

    List<Task> findByCompleted(boolean completed);

    List<Task> findByTitleContainingIgnoreCase(String keyword);

    List<Task> findByPriorityAndCompleted(Priority priority, boolean completed);

}
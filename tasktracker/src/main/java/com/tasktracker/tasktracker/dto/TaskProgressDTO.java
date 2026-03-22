package com.tasktracker.tasktracker.dto;

import com.tasktracker.tasktracker.model.Priority;

public class TaskProgressDTO {

    private String priority;
    private Long count;

    // 🔥 THIS CONSTRUCTOR IS REQUIRED
    public TaskProgressDTO(Priority priority, Long count) {
        this.priority = priority.name(); // enum → String
        this.count = count;
    }

    // getters (mandatory)
    public String getPriority() {
        return priority;
    }

    public Long getCount() {
        return count;
    }
}
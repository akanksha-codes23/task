package com.tasktracker.tasktracker.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.tasktracker.tasktracker.model.Priority;
import com.tasktracker.tasktracker.model.Status;

public class TaskResponseDTO {

    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;

    // ⭐ Due Date
    private LocalDate dueDate;

    // ⭐ Created Date
    private LocalDateTime createdAt;

    // ===== getters & setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    // ⭐ CREATED DATE GETTER SETTER

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
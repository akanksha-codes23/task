package com.tasktracker.tasktracker.mapper;

import org.springframework.stereotype.Component;

import com.tasktracker.tasktracker.dto.TaskRequestDTO;
import com.tasktracker.tasktracker.dto.TaskResponseDTO;
import com.tasktracker.tasktracker.model.Task;

@Component
public class TaskMapper {

    public Task toEntity(TaskRequestDTO dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());

        // ⭐ Due Date
        task.setDueDate(dto.getDueDate());

        return task;
    }

    public TaskResponseDTO toResponse(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());

        // ⭐ Due Date
        dto.setDueDate(task.getDueDate());

        // ⭐ Created Date
        dto.setCreatedAt(task.getCreatedAt());

        return dto;
    }

    public void updateTask(TaskRequestDTO dto, Task task) {
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());

        // ⭐ Due Date
        task.setDueDate(dto.getDueDate());
    }
}
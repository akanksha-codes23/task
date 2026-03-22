package com.tasktracker.tasktracker.controller;
import org.springframework.data.domain.Page;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;

import com.tasktracker.tasktracker.dto.TaskProgressDTO;
import org.springframework.data.domain.Sort;


import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tasktracker.tasktracker.dto.TaskRequestDTO;
import com.tasktracker.tasktracker.dto.TaskResponseDTO;
import com.tasktracker.tasktracker.exceptions.ResourceNotFoundException;
import com.tasktracker.tasktracker.mapper.TaskMapper;
import com.tasktracker.tasktracker.model.Task;
import com.tasktracker.tasktracker.repository.TaskRepository;
import com.tasktracker.tasktracker.model.Status;
import com.tasktracker.tasktracker.model.Priority;


import jakarta.validation.Valid;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskMapper taskMapper;

    // ================= CREATE TASK =================
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(
            @Valid @RequestBody TaskRequestDTO requestDTO) {

    	Task task = taskMapper.toEntity(requestDTO);
    	Task savedTask = taskRepository.save(task);
    	return new ResponseEntity<>(taskMapper.toResponse(savedTask), HttpStatus.CREATED);

    }

    // ================= GET ALL TASKS =================
//    @GetMapping
//    public Page<TaskResponseDTO> getAllTasks(
//            @RequestParam(required = false) Status status,
//            @RequestParam(required = false) Priority priority,
//            @RequestParam(required = false) String search,
//            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC)
//            Pageable pageable) {
//
//        if (search != null && !search.isBlank()) {
//            return taskRepository
//                    .findByTitleContainingIgnoreCase(search, pageable)
//                    .map(taskMapper::toResponse);
//        }
//
//        if (status != null && priority != null) {
//            return taskRepository
//                    .findByStatusAndPriority(status, priority, pageable)
//                    .map(taskMapper::toResponse);
//        }
//
//        if (status != null) {
//            return taskRepository
//                    .findByStatus(status, pageable)
//                    .map(taskMapper::toResponse);
//        }
//
//        if (priority != null) {
//            return taskRepository
//                    .findByPriority(priority, pageable)
//                    .map(taskMapper::toResponse);
//        }
//
//        return taskRepository.findAll(pageable)
//                .map(taskMapper::toResponse);
//    }

    @GetMapping
    public Page<TaskResponseDTO> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {

        Page<Task> page = taskRepository.searchTasks(
                (search == null || search.isBlank()) ? null : search,
                status,
                priority,
                pageable
        );

        return page.map(taskMapper::toResponse);
    }




    // ================= GET TASK BY ID =================
    @GetMapping("/{id}")
    public TaskResponseDTO getTaskById(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found with id " + id));

        return taskMapper.toResponse(task);
    }


    // ================= UPDATE TASK =================
    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO requestDTO) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found with id " + id));

        taskMapper.updateTask(requestDTO, existingTask);


        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toResponse(updatedTask);
    }


    // ================= DELETE TASK =================
  
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found with id " + id));

        taskRepository.delete(task);

        return ResponseEntity.noContent().build(); // 204
    }
 // ================= TASK PROGRESS =================

 // WEEKLY PROGRESS (last 7 days)
 @GetMapping("/progress/weekly")
 public List<TaskProgressDTO> weeklyProgress() {
     LocalDateTime startDate = LocalDateTime.now().minusDays(7);
     return taskRepository.countTasksByPriorityAfterDate(startDate);
 }

 // MONTHLY PROGRESS (current month)
 @GetMapping("/progress/monthly")
 public List<TaskProgressDTO> monthlyProgress() {
     LocalDateTime startDate = LocalDateTime
             .now()
             .withDayOfMonth(1)
             .withHour(0)
             .withMinute(0)
             .withSecond(0)
             .withNano(0);

     return taskRepository.countTasksByPriorityAfterDate(startDate);
 }
}

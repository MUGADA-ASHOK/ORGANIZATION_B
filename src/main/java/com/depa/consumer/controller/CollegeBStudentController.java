package com.depa.consumer.controller;

import com.depa.consumer.entity.StudentRecord;
import com.depa.consumer.service.CollegeBStudentRegistry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class CollegeBStudentController {

    private final CollegeBStudentRegistry studentRegistry;

    public CollegeBStudentController(CollegeBStudentRegistry studentRegistry) {
        this.studentRegistry = studentRegistry;
    }

    @GetMapping
    public ResponseEntity<List<StudentRecord>> getAllStudents() {
        return ResponseEntity.ok(studentRegistry.getAllStudents());
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentRecord> getStudentById(@PathVariable("studentId") String studentId) {
        return studentRegistry.findByStudentId(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentRecord> registerStudent(@RequestBody StudentRecord student) {
        studentRegistry.registerStudent(student);
        return ResponseEntity.ok(student);
    }
}

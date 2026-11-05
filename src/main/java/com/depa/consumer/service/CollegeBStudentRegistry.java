package com.depa.consumer.service;

import com.depa.consumer.entity.StudentRecord;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CollegeBStudentRegistry {

    private final Map<String, StudentRecord> registry = new ConcurrentHashMap<>();

    public CollegeBStudentRegistry() {
        // Pre-populate College B's authentic student registry
        seedStudent(new StudentRecord(
                "S2001",
                "Sneha Rao",
                "sneha.rao@collegeb.edu",
                "Computer Science & Engineering",
                "9.2",
                "92% (First Class with Distinction)",
                "ACTIVE",
                "CERT-CB-2026-S2001-VERIFIED",
                "Bachelor of Technology in Computer Science"
        ));

        seedStudent(new StudentRecord(
                "S2002",
                "Aditya Varma",
                "aditya.varma@collegeb.edu",
                "Data Engineering & AI",
                "8.8",
                "88% (First Class)",
                "ACTIVE",
                "CERT-CB-2026-S2002-VERIFIED",
                "Bachelor of Technology in Data Science"
        ));

        seedStudent(new StudentRecord(
                "S1006",
                "Rohan Mehta",
                "rohan.mehta@collegeb.edu",
                "Information Technology",
                "9.0",
                "90% (Distinction)",
                "ACTIVE",
                "CERT-CB-2026-S1006-VERIFIED",
                "Bachelor of Technology in IT"
        ));
    }

    private void seedStudent(StudentRecord student) {
        registry.put(student.getStudentId().toUpperCase(), student);
    }

    public Optional<StudentRecord> findByStudentId(String studentId) {
        if (studentId == null) return Optional.empty();
        return Optional.ofNullable(registry.get(studentId.trim().toUpperCase()));
    }

    public List<StudentRecord> getAllStudents() {
        return new ArrayList<>(registry.values());
    }

    public void registerStudent(StudentRecord student) {
        if (student != null && student.getStudentId() != null) {
            registry.put(student.getStudentId().trim().toUpperCase(), student);
        }
    }
}


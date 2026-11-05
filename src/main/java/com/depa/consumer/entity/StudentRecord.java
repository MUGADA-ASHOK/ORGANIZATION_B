package com.depa.consumer.entity;

public class StudentRecord {
    private String studentId;
    private String name;
    private String email;
    private String department;
    private String cgpa;
    private String marks;
    private String status;
    private String studyCertificate;
    private String degree;

    public StudentRecord() {}

    public StudentRecord(String studentId, String name, String email, String department,
                         String cgpa, String marks, String status, String studyCertificate, String degree) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.cgpa = cgpa;
        this.marks = marks;
        this.status = status;
        this.studyCertificate = studyCertificate;
        this.degree = degree;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }

    public String getMarks() { return marks; }
    public void setMarks(String marks) { this.marks = marks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStudyCertificate() { return studyCertificate; }
    public void setStudyCertificate(String studyCertificate) { this.studyCertificate = studyCertificate; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
}

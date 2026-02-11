# Task Tracker

A full-stack task management application built with Spring Boot and vanilla JavaScript.

## Features
- Full CRUD operations (Create, Read, Update, Delete)
- Task priority levels (HIGH, MEDIUM, LOW)
- Task categories (WORK, PERSONAL, STUDY, HEALTH, FINANCE)
- Task descriptions
- Due dates
- Auto-timestamps (createdAt, updatedAt)
- Filter tasks by priority, completion status, or both combined
- Search tasks by title (case-insensitive)
- Sort by due date, priority, or date created
- Input validation with custom exception handling
- Layered architecture (Controller → Service → Repository)
- Frontend UI with live filtering, search, and task management

## Technologies Used
- Java 21
- Spring Boot
- Spring Data JPA
- H2 Database
- Maven
- HTML / CSS / JavaScript

## Future Improvements
- DTOs (Data Transfer Objects) for API security
- Additional validation on priority and due date fields
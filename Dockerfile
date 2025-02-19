# ===== Stage 1: Build the Go Backend =====
FROM golang:1.21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN go build -o main .

# ===== Stage 2: Copy the React Frontend (Already Built) =====
FROM node:18 AS frontend-build

# Set working directory for React
WORKDIR /frontend

# Copy only the built React files (from your local "frontend/build")
COPY frontend/build /frontend/build

# ===== Stage 3: Final Container with Backend + Frontend =====
FROM ubuntu:latest

# Set working directory
WORKDIR /app

# Copy the compiled Go backend binary
COPY --from=build /app/main .

# Copy the already built React frontend files
COPY --from=frontend-build /frontend/build ./frontend

# Copy .env file (optional, better to use --env-file)
COPY .env /app/.env

# Set environment variables
ENV PORT=8080

# Expose the port
EXPOSE $PORT

# Run the Go application
CMD ["sh", "-c", "./main"]




# How to Build and Run
# Build the Docker image
# docker build -t alrihiesu-language-register .

# Run the container with the .env file
# docker run --env-file .env -p 8080:8080 alrihiesu-language-register
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

# ===== Stage 2: Build the React Frontend =====
FROM node:18 AS frontend-build

# Set working directory for React
WORKDIR /frontend

# Copy frontend package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy the rest of the React source code
COPY frontend ./

# Build the React app for production
RUN npm run build

# ===== Stage 3: Final Container with Backend + Frontend =====
FROM ubuntu:latest

# Set working directory
WORKDIR /app

# Copy the compiled Go backend binary
COPY --from=build /app/main .

# Copy the React build output
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
#docker build -t my-golang-app .

# Run the container with the .env file
#docker run --env-file .env -p 8080:8080 my-golang-app
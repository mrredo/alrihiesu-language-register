# ===== Stage 1: Build Backend =====
FROM golang:1.21 AS build

WORKDIR /app

# Copy and download Go dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .
RUN go build -o main .

# ===== Stage 2: Build Frontend =====
FROM node:20 AS frontend-build

WORKDIR /app/frontend
COPY ./frontend ./
RUN npm install && npm run build

# ===== Stage 3: Final Container with Backend + Frontend =====
FROM ubuntu:latest

WORKDIR /app

# Install necessary dependencies
RUN apt update && apt install -y ca-certificates

# Copy compiled Go backend
COPY --from=build /app/main .

# Copy built frontend files
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Debugging: Check if frontend files exist
RUN ls -l /app/frontend/build || true

# Copy .env file
COPY .env /app/.env

# Set environment variables
ENV PORT=312

# Expose the port
EXPOSE $PORT

# Run the Go application
CMD ["sh", "-c", "./main"]

# Use a Java 23 JDK image to build the Spring Boot app
FROM eclipse-temurin:23-jdk AS build

# Set working directory
WORKDIR /app

# Copy everything into the container (we're already in the project root)
COPY . .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Build the app (skip tests to speed up)
RUN ./mvnw clean package -DskipTests

# Use a smaller JRE image to run the app
FROM eclipse-temurin:23-jre

# Set working directory
WORKDIR /app

# Copy only the final jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the app port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

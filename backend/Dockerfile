# syntax=docker/dockerfile:1.4

# ----------------------------
# Stage 1: Build (Maven + JDK)
# ----------------------------
FROM --platform=$BUILDPLATFORM maven:3.8.5-eclipse-temurin-17 AS builder
WORKDIR /workdir/server

# Сначала копируем pom.xml и подтягиваем зависимости (кэшируем слой)
COPY pom.xml .
RUN mvn dependency:go-offline

# Копируем исходники и собираем JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ----------------------------
# Stage 2: Dev environment
# ----------------------------
FROM builder AS dev
WORKDIR /workdir/server
# Для dev можно запускать spring-boot:run
CMD ["mvn", "spring-boot:run"]

# ----------------------------
# Stage 3: Prepare production dependencies
# ----------------------------
FROM builder AS prepare-production
WORKDIR /workdir/server/target/dependency
RUN mkdir -p . && jar -xf ../*.jar

# ----------------------------
# Stage 4: Production image
# ----------------------------
FROM eclipse-temurin:17-jre-focal
WORKDIR /app
EXPOSE 8080
VOLUME /tmp

# Аргумент указывает путь к распакованным зависимостям
ARG DEPENDENCY=/workdir/server/target/dependency

# Копируем классы и библиотеки из стадии подготовки
COPY --from=prepare-production ${DEPENDENCY}/BOOT-INF/lib ./lib
COPY --from=prepare-production ${DEPENDENCY}/BOOT-INF/classes ./classes
COPY --from=prepare-production ${DEPENDENCY}/META-INF ./META-INF

# ENTRYPOINT с корректными путями и главным классом
ENTRYPOINT ["java","-cp","classes:lib/*","org.project.spring.SpringApplication"]


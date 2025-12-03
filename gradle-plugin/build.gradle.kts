plugins {
    `kotlin-dsl`
    `java-gradle-plugin`
    `maven-publish`
    id("com.gradle.plugin-publish") version "1.2.1"
}

group = "com.meiji.build"
version = "1.0.0"

gradlePlugin {
    plugins {
        create("environmentCheck") {
            id = "com.meiji.build.environment-check"
            implementationClass = "com.meiji.build.EnvironmentCheckPlugin"
            displayName = "Meiji Environment Check"
            description = "Enforces CI/CD and local environment configuration standards."
        }
    }
}

repositories {
    mavenCentral()
}
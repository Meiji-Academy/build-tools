plugins {
    `kotlin-dsl`
    `java-gradle-plugin`
    `maven-publish`
    id("com.gradle.plugin-publish") version "1.2.1"
}

group = "com.meiji.build"
version = "1.0.0"

gradlePlugin {
    website.set("https://github.com/meiji-academy/build-tools")
    vcsUrl.set("https://github.com/meiji-academy/build-tools")

    plugins {
        create("environmentCheck") {
            id = "com.meiji.build.environment-check"
            implementationClass = "com.meiji.build.EnvironmentCheckPlugin"
            displayName = "Meiji Environment Check"
            description = "Enforces CI/CD and local environment configuration standards."
            tags.set(listOf("build", "environment", "check", "ci", "security"))
        }
    }
}

repositories {
    mavenCentral()
}